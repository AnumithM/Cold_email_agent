export default function Skeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div>
        <div className="h-3 w-24 bg-gray-700 rounded mb-3" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-11 bg-gray-800 rounded-lg shimmer" />
          ))}
        </div>
      </div>
      <div>
        <div className="h-3 w-20 bg-gray-700 rounded mb-3" />
        <div className="h-48 bg-gray-800 rounded-lg shimmer" />
      </div>
      <div className="h-10 bg-gray-800 rounded-lg shimmer" />
    </div>
  );
}
