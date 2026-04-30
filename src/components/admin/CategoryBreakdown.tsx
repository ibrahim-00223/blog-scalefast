interface CategoryRow {
  name: string;
  count: number;
}

interface CategoryBreakdownProps {
  rows: CategoryRow[];
}

export function CategoryBreakdown({ rows }: CategoryBreakdownProps) {
  const max = Math.max(...rows.map((r) => r.count), 1);

  return (
    <div className="sf-card p-6">
      <h2 className="mb-4 text-base font-bold text-sf-navy">Articles publiés par catégorie</h2>

      {rows.length === 0 ? (
        <p className="text-sm text-sf-gray-400">Aucun article publié pour l&apos;instant.</p>
      ) : (
        <ul className="space-y-3">
          {rows.map(({ name, count }) => (
            <li key={name}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium text-sf-navy">{name}</span>
                <span className="text-sf-gray-600">{count}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-sf-gray-200">
                <div
                  className="h-full rounded-full bg-sf-blue transition-all"
                  style={{ width: `${(count / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
