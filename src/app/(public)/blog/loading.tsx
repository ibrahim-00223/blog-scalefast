function SkeletonCard() {
  return (
    <div className="sf-card flex flex-col gap-4 overflow-hidden p-0 animate-pulse">
      <div className="h-48 w-full bg-sf-gray-200 rounded-t-[18px]" />
      <div className="flex flex-col gap-3 p-5">
        <div className="h-4 w-24 rounded-full bg-sf-gray-200" />
        <div className="h-6 w-full rounded bg-sf-gray-200" />
        <div className="h-4 w-3/4 rounded bg-sf-gray-200" />
        <div className="h-4 w-1/2 rounded bg-sf-gray-200" />
        <div className="mt-2 h-3 w-32 rounded bg-sf-gray-200" />
      </div>
    </div>
  );
}

export default function BlogLoading() {
  return (
    <div className="pb-16">
      {/* Hero skeleton */}
      <section className="sf-container pt-14 md:pt-20">
        <div className="sf-card overflow-hidden p-8 md:p-12 animate-pulse">
          <div className="max-w-3xl space-y-6">
            <div className="h-6 w-48 rounded-full bg-sf-gray-200" />
            <div className="h-14 w-3/4 rounded bg-sf-gray-200" />
            <div className="h-4 w-full rounded bg-sf-gray-200" />
            <div className="h-4 w-2/3 rounded bg-sf-gray-200" />
            <div className="flex gap-3">
              <div className="h-11 w-40 rounded-full bg-sf-gray-200" />
              <div className="h-11 w-52 rounded-full bg-sf-gray-200" />
            </div>
          </div>
        </div>
      </section>

      {/* Articles grid skeleton */}
      <section className="sf-container pt-16">
        <div className="mb-8 space-y-2 animate-pulse">
          <div className="h-3 w-32 rounded bg-sf-gray-200" />
          <div className="h-8 w-80 rounded bg-sf-gray-200" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
