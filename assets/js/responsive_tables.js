// set data-title attribute on table cells
function responsiveTables() {
  const tables = document.getElementById("main-content-wrapper").getElementsByTagName("table")
  for (table of tables) {
    const headings = table.getElementsByTagName("th")
    const tbody = table.getElementsByTagName("tbody")
    if (tbody.length > 0){
      const rows = tbody[0].getElementsByTagName("tr")
      for (row of rows) {
        const cells = row.getElementsByTagName("td")
        for (i = 0; i < cells.length; i++) {
          if (headings.length >= i + 1) {
            cells[i].setAttribute("data-title", headings[i].innerText.trim().concat(": "))
          }
        }
      }
    }
  }
}
responsiveTables()