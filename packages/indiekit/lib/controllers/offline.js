import { getServiceWorker } from "../utils.js";

export const offline = (request, response) => {
  response.render("offline", {
    title: response.locals.__("offline.title"),
  });
};

export const serviceworker = async (request, response) => {
  const { application } = request.app.locals;
  const serviceworker = await getServiceWorker(application);

  return response.type("text/javascript").send(serviceworker).end();
};
