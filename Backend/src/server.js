import app from './app.js';






app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port http://localhost:${process.env.PORT}`);
});
