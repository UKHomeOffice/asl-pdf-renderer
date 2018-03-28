const fetch = require('r2');
const https = require('https');

module.exports = host => {
  const pdfIsSecure = host.match(/^https:/);
  const agent = pdfIsSecure && new https.Agent({
    rejectUnauthorized: false
  });
  return (req, res, next) => {
    res.pdf = (templateFile, locals, options) => {
      const defaults = {
        pdf: true,
        hostname: `${req.protocol}://${req.get('host')}`
      };
      const pdfOptions = Object.assign({
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: '<p/>',
        footerTemplate: '<p style="font-size:10px;margin-left:40px;position:relative;top:12px;">Page <span class="pageNumber"></span> of <span class="totalPages"></p>',
        margin: {
          top: 30,
          left: 30,
          right: 30,
          bottom: 40
        }
      }, options);
      return res.render(templateFile, Object.assign({}, locals, defaults), (err, template) => {
        if (err) return next(err);
        return fetch
          .post(host, {
            json: { template, pdfOptions },
            agent
          }).response
          .then(response => response.buffer())
          .then(data => {
            res.type('application/pdf');
            res.send(data);
          })
          .catch(next);
      });
    };
    next();
  };
};
