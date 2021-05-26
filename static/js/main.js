window.onload = function() {
    this.initSearchBar()
    this.updateTimeHook()
}

function initSearchBar() {
    // Clear the search bar on load, just in case
    document.getElementById("search-bar-input").value = ""
    document.getElementById("search-bar-input").focus()

    searchUrl = "https://www.google.com/search?q="
    document.getElementById("search-bar-input").placeholder = `Search something`
    document.getElementById("search-bar-input").addEventListener("keypress", (event) => {
        if (event.key != 'Enter') return
        query = document.getElementById("search-bar-input").value
        query = query.replace(/\ /g, "+")
        document.location = searchUrl + query
    })
}

function updateTime() {
    /**
     * Get the current time and date and return it.
     */
    currentDate = new Date()
    options = {
                day: 'numeric',
                month: 'short',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
                timeZone: undefined
            }
    finalDate = currentDate.toLocaleString(undefined, options)
    document.getElementById("date-text").textContent = finalDate
}

function updateTimeHook() {
    updateTime()
    interval = setInterval(() => {
        updateTime()
    }, 30 * 1000)
}

// Align the height of the trello div and the container div
