// Grab some packages from Node.
const path = require("path");
const slash = require("slash");

/**
 * Programmatically create posts, pages, and the archives.
 */
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const result = await graphql(`
    query {
      wordpress {
        posts {
          edges {
            node {
              id
              postId
              slug
              status
            }
          }
        }
        pages {
          edges {
            node {
              id
              pageId
              slug
              status
            }
          }
        }
        categories {
          edges {
            node {
              id
              categoryId
              slug
              description
              name
            }
          }
        }
        tags {
          edges {
            node {
              id
              tagId
              slug
              description
              name
            }
          }
        }
        users {
          edges {
            node {
              id
              userId
              name
              slug
            }
          }
        }
      }
    }
  `);

  if (result.errors) {
    throw new Error(result.errors);
  }

  const { posts, pages, categories, tags, users } = result.data.wordpress;

  // Create posts.
  const postTemplate = path.resolve(`./src/templates/post.js`);
  posts.edges.forEach(edge => {
    createPage({
      path: `/${edge.node.slug}/`,
      component: slash(postTemplate),
      context: {
        id: edge.node.id,
        wordpress_id: edge.node.pageId
      }
    });
  });

  // Create pages.
  const pageTemplate = path.resolve(`./src/templates/page.js`);
  pages.edges.forEach(edge => {
    createPage({
      path: `/${edge.node.slug}/`,
      component: slash(pageTemplate),
      context: {
        id: edge.node.id
      }
    });
  });

  // Create category archives.
  const categoryTemplate = path.resolve(`./src/templates/category.js`);
  categories.edges.forEach(edge => {
    createPage({
      path: `/category/${edge.node.slug}/`,
      component: slash(categoryTemplate),
      context: {
        id: edge.node.id
      }
    });
  });

  // Create tag archives.
  const tagTemplate = path.resolve(`./src/templates/tag.js`);
  tags.edges.forEach(edge => {
    createPage({
      path: `/tag/${edge.node.slug}/`,
      component: slash(tagTemplate),
      context: {
        id: edge.node.id
      }
    });
  });

  // Create author archives.
  const authorTemplate = path.resolve(`./src/templates/author.js`);
  users.edges.forEach(edge => {
    createPage({
      path: `/author/${edge.node.slug}/`,
      component: slash(authorTemplate),
      context: {
        id: edge.node.id
      }
    });
  });
};
