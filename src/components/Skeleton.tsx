export default function SkeletonCard() {
  return (
    <div className="card">
      <div className="skeleton poster" />
      <div className="body">
        <div className="skeleton line" style={{ width:'80%' }} />
        <div className="skeleton line" style={{ width:'50%' }} />
      </div>
    </div>
  );
}
