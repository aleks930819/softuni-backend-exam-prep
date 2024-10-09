/**
 * Renders a page with errors using the Express response object.
 *
 * @param {Object} params - The parameters for rendering the page.
 * @param {import('express').Response} params.res - The Express response object.
 * @param {string} params.page - The name of the page to render.
 * @param {Array} params.errors - An array of errors to display on the page.
 * @param {string} params.title - The title of the page.
 *
 * @returns {void}
 */
const renderPageWithErrors = ({ res, page, errors, title }) => {
  res.render(page, {
    title,
    errors,
  });
};

module.exports = renderPageWithErrors;
