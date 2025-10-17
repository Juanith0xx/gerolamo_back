import Post from "../models/Post.js";

// Obtener posts pendientes
export const getPendingPosts = async (req, res) => {
  try {
    const posts = await Post.find({ status: "pending" });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: "Error al obtener posts", error: err.message });
  }
};

// Aprobar post
export const approvePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { status: "published" },
      { new: true }
    );
    if (!post) return res.status(404).json({ msg: "Post no encontrado" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ msg: "Error al aprobar post", error: err.message });
  }
};

// Rechazar post
export const rejectPost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ msg: "Post no encontrado" });
    res.json({ msg: "Post rechazado y eliminado" });
  } catch (err) {
    res.status(500).json({ msg: "Error al rechazar post", error: err.message });
  }
};
