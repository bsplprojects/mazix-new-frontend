const GSTReport = () => {
  return (
    <main>
      <div className="flex flex-col gap-4  border-white/10 p-5 lg:flex-col lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white">
                GST Report
              </h2>

              <p className="mt-1 text-sm text-zinc-400">
                Showing{" "}
                <span className="font-semibold text-yellow-400">
                  {/* {filteredUsers.length} */}
                </span>{" "}
                results
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default GSTReport;
