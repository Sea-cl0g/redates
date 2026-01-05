import "../styles/Image.css"; // ← ここで関連付け！

export default function Image() {
  return (
    <div className="card">
      <div className="image-grid">
        <img src="https://images.dog.ceo/breeds/shiba/shiba-8.jpg" alt="cute dog!" />
        <img src="https://images.dog.ceo/breeds/shiba/shiba-9.jpg" alt="cute dog!" />
        <img src="https://images.dog.ceo/breeds/shiba/shiba-10.jpg" alt="cute dog!" />
      </div>
    </div>
  );
}
