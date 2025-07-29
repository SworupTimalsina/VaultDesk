import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface Post {
  _id: string;
  text: string;
  image?: string;
  createdAt: string;
}

const MyPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchPosts = async () => {
    try {
      const res = await axios.get("https://localhost:3000/api/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.posts)
        ? res.data.posts
        : [];

      setPosts(data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to fetch posts");
    }
  };

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return toast.warning("Post content is required");

    const formData = new FormData();
    formData.append("text", text);
    if (image) formData.append("image", image);

    try {
      setLoading(true);
      const res = await axios.post("https://localhost:3000/api/posts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const newPost = res.data?.post;
      if (newPost) {
        setPosts([newPost, ...posts]);
        toast.success("Post added");
      }

      setText("");
      setImage(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add post");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(`https://localhost:3000/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      toast.success("Post deleted");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete post");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">My Posts</h2>

      {/* 🔼 Add Post Form */}
      <form onSubmit={handleAddPost} className="mb-6 space-y-4" encType="multipart/form-data">
        <textarea
          className="w-full border rounded p-2"
          placeholder="What's on your mind?"
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Posting..." : "Add Post"}
        </button>
      </form>

      {/* 🔽 Post List */}
      {Array.isArray(posts) && posts.length > 0 ? (
        posts.map((post) => (
          <div
            key={post._id}
            className="bg-gray-50 border p-4 rounded mb-4 relative"
          >
            <p className="text-gray-800 mb-2 whitespace-pre-line">{post.text}</p>
            {post.image && (
              <img
                src={`https://localhost:3000/uploads/${post.image}`}
                alt="Post"
                className="w-full max-h-64 object-cover rounded mb-2"
              />
            )}
            <div className="text-sm text-gray-400 mt-1">
              {new Date(post.createdAt).toLocaleString()}
            </div>
            <button
              onClick={() => handleDeletePost(post._id)}
              className="absolute top-2 right-2 text-red-600 hover:underline text-sm"
            >
              Delete
            </button>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">You haven't posted anything yet.</p>
      )}
    </div>
  );
};

export default MyPosts;
