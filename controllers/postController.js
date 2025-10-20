import Post from "../models/Post.js";

// Crear post (status por defecto: pending)
export const createPost = async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const newPost = new Post({ title, content, author }); // status: pending por defecto
    await newPost.save();
    res.json({ msg: "Post creado correctamente y pendiente de aprobación" });
  } catch (err) {
    res.status(500).json({ msg: "Error creando post" });
  }
};

// Obtener posts pendientes (solo admin)
export const getPendingPosts = async (req, res) => {
  try {
    const posts = await Post.find({ status: "pending" }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: "Error obteniendo posts pendientes" });
  }
};

// Aprobar post
export const approvePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    res.json({ msg: "Post aprobado", post });
  } catch (err) {
    res.status(500).json({ msg: "Error al aprobar post" });
  }
};

// Rechazar/eliminar post
export const rejectPost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ msg: "Post rechazado y eliminado" });
  } catch (err) {
    res.status(500).json({ msg: "Error al rechazar post" });
  }
};

// Obtener posts aprobados (para el blog)
export const getApprovedPosts = async (req, res) => {
  try {
    const posts = await Post.find({ status: "approved" }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: "Error al obtener posts aprobados" });
  }
};

// Actualizar post (solo admin)
export const updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );
    res.json({ msg: "Post actualizado", post });
  } catch (err) {
    res.status(500).json({ msg: "Error al actualizar post" });
  }
};

// Eliminar post (solo admin)
export const deletePost = async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ msg: "Post eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ msg: "Error al eliminar post" });
  }
};