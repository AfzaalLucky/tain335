define (['./test/ejs/test.ejs'] , function(require) {
 var EJS = require('ace-ejs');
 return {
 tpl : new EJS({'text': '<% if (names.length) { %>
  <ul>
    <% names.forEach(function(name){ %>
      <li foo=\'<%= name%>\'><%= name + \'\' %></li>
    <% }) %>
  </ul>
<% } %>'})};
});