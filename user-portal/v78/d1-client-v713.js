(function () {
  const config = window.OCTOPUS_API_CONFIG;
  if (!config) return;

  async function getRecords(view) {
    const url = new URL(config.sharedRecordsPath, config.baseUrl);
    if (view) url.searchParams.set("view", view);
    const response = await fetch(url, {
      method: "GET",
      mode: "cors",
      credentials: "omit",
      headers: { Accept: "application/json" }
    });
    if (!response.ok) throw new Error(`Octopus API ${response.status}`);
    return response.json();
  }

  window.OctopusDataAPI = Object.freeze({
    getRecords,
    getPartners: () => getRecords("partners-0"),
    getTasks: () => getRecords("resources-1"),
    getReviews: () => getRecords("risk-2"),
    getChannels: () => getRecords("channels-0"),
    getAnalytics: () => getRecords()
  });

  getRecords()
    .then((payload) => {
      window.__OCTOPUS_SHARED_DATA__ = payload;
      window.dispatchEvent(
        new CustomEvent("octopus:data-ready", { detail: payload })
      );
      document.dispatchEvent(
        new CustomEvent("octopus:data-ready", { detail: payload })
      );
    })
    .catch((error) => {
      window.__OCTOPUS_DATA_ERROR__ = error.message;
      window.dispatchEvent(
        new CustomEvent("octopus:data-error", { detail: { message: error.message } })
      );
    });
})();
