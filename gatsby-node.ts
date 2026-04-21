import type { GatsbyNode } from "gatsby";

export const onCreatePage: GatsbyNode["onCreatePage"] = ({ page, actions }) => {
  const { createPage } = actions;

  // Make /launch/* a client-only route so Gatsby doesn't 404 on direct access
  if (page.path.match(/^\/launch/)) {
    page.matchPath = "/launch/:id";
    createPage(page);
  }
};
