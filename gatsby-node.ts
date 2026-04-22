import type { GatsbyNode } from "gatsby";

export const onCreatePage: GatsbyNode["onCreatePage"] = ({ page, actions }) => {
  const { createPage } = actions;

  // Make /transaction/* a client-only route so Gatsby doesn't 404 on direct
  // access or refresh. The `:id` segment is parsed from the URL and handed
  // to the page component via `params`.
  if (page.path.match(/^\/transaction/)) {
    page.matchPath = "/transaction/:id";
    createPage(page);
  }
};
