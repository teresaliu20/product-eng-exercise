import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans

def cluster_feedback(feedback):
  # Load the CSV file
  # file_path = "feedback_data.csv"  # <-- Change this to your actual file path
  df = pd.DataFrame.from_dict(feedback)

  # Convert feedback descriptions into TF-IDF vectors
  vectorizer = TfidfVectorizer(stop_words="english", max_features=5000)
  X = vectorizer.fit_transform(df["description"].astype(str))

  # Determine the optimal number of clusters using the Elbow Method
  def find_optimal_clusters(data, max_k=10):
      inertia_values = []
      for k in range(2, max_k):
          kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
          kmeans.fit(data)
          inertia_values.append(kmeans.inertia_)

      # Find the "elbow" point
      diffs = np.diff(inertia_values)
      optimal_k = np.argmin(diffs) + 2  # +2 to adjust for index shift

      return optimal_k

  # Find the best number of clusters
  optimal_k = find_optimal_clusters(X)

  # Apply KMeans clustering
  kmeans = KMeans(n_clusters=optimal_k, random_state=42, n_init=10)
  df["cluster"] = kmeans.fit_predict(X)

  # Group the feedback by clusters
  grouped_feedback = {}
  for cluster in range(optimal_k):
      cluster_data = df[df["cluster"] == cluster]
      trend_summary = " | ".join(cluster_data["name"].unique())

      grouped_feedback[cluster] = {
          "summary": trend_summary,
          "feedback_entries": cluster_data.to_dict(orient="records")
      }
  priority_df = prioritize_trends(grouped_feedback)

  refined_priority_df = generate_keyword_summaries(priority_df, grouped_feedback, vectorizer)
  return refined_priority_df

# Prioritize trends based on importance
def prioritize_trends(grouped_feedback):
    priority_list = []

    for cluster, data in grouped_feedback.items():
        feedback_entries = data["feedback_entries"]
        total_count = len(feedback_entries)
        high_importance_count = sum(1 for entry in feedback_entries if entry["importance"] == "High")

        priority_list.append({
            "Cluster": cluster,
            "Summary": data["summary"],
            "High Importance Count": high_importance_count,
            "Total Feedback Count": total_count,
            "Priority Score": high_importance_count * 2 + total_count  # Weighted score
        })

    priority_df = pd.DataFrame(priority_list)
    priority_df = priority_df.sort_values(by="Priority Score", ascending=False).reset_index(drop=True)
    return priority_df


# Generate readable summaries based on keywords in each cluster
def generate_keyword_summaries(priority_df, grouped_feedback, vectorizer):
    refined_list = []
    
    for _, row in priority_df.iterrows():
        cluster_id = row["Cluster"]
        feedback_data = grouped_feedback[cluster_id]["feedback_entries"]

        cluster_name = f"Cluster {cluster_id}: {feedback_data[0]['name']}" if feedback_data else f"Cluster {cluster_id}"

        # Extract descriptions
        descriptions = [entry["description"] for entry in feedback_data]
        
        # Get the most common words in the cluster
        cluster_text = " ".join(descriptions)
        cluster_vector = vectorizer.transform([cluster_text])
        feature_array = np.array(vectorizer.get_feature_names_out())
        top_keywords = feature_array[np.argsort(cluster_vector.toarray()).flatten()][-5:]  # Top 5 words

        summary = f"This cluster is based off key words: {', '.join(top_keywords)}. "
        summary += "Preview of feedback includes: " + "; ".join(descriptions[:4])

        refined_list.append({
            "id": cluster_id,
            "name": cluster_name,
            "summary": summary,
            "highImportanceCount": row["High Importance Count"],
            "totalFeedbackCount": row["Total Feedback Count"],
            "priority": row["Priority Score"],
            "feedback": feedback_data
        })

    return refined_list


