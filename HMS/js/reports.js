const reports = {

    /**
     * Requests a list of reports from the database, with a callback to reports.build_html.
     */
    update_request: function() {
        networking.HTTPToDB({
            "query": {
                "title": { $regex: "(?i)" + "" + "(?-i)" }
            }
        }, "reports", reports.build_html, "get", "albretsenconsulting");
    },

    /**
     * 
     * @param {A report object} report 
     * Takes a report, and adds it to the list of reports.
     */
    build_report_row: function(report) {
        console.log(report)
        var title = report.title;
        var description = report.description;
        if (report.title == "") {
            title = i18n.get("ingen_tittel");
        }
        if (report.description == "") {
            console.log("thest " + i18n.get("ingen_beskrivelse"))
            description = i18n.get("ingen_beskrivelse");
        }
        var icon_style;
        var icon_name;
        // Determine which icon to use
        switch (report.status) {
            case 'In review':
                let current_date = new Date().getTime().toString();
                if ((parseInt(current_date) - parseInt(report.date_sent)) > 2628000000) { // If the report was made long ago and is still not done, make urgent. (I don't remember how long)
                    icon_name = 'priority_high';
                    icon_style = 'reportUrgent';
                } else { // Else just make icon unreviewed
                    icon_name = 'schedule';
                    icon_style = 'reportUnread';
                }
                break;
            case 'Done':
                icon_name = 'done';
                icon_style = 'reportRead';
                break;
        }
        const container = create_element("DIV", ["class", "reportSection", "onclick", ""]);
        const text_container = create_element("DIV", ["class", "report-display-text"]);

        const author = create_element("DIV", ["class", "report-author-display"], `${report.author_name} - ${report.date_sent}`);
        text_container.appendChild(author);

        const title_div = create_element("DIV", ["class", "reportTitle"], `${title}`);
        text_container.appendChild(title_div);

        const description_div = create_element("DIV", ["class", "report-preview"], `${description}`);
        text_container.appendChild(description_div);

        container.appendChild(text_container);

        const icon_container = create_element("DIV", ["class", "report-display-icon"]);
        const icon = create_element("I", ["class", `material-icons icon reportIcon ${icon_style}`], icon_name);
        icon_container.appendChild(icon);

        container.appendChild(icon_container);

        byId("report-anchor").appendChild(container);
    },

    /**
     * 
     * @param {A string, which is a list of report objects} reports 
     * Goes through each report, then calls reports.build_report_row to generate each row of reports.
     */
    build_html: function(reports_) {
        reports_ = JSON.parse(reports_);
        console.log("AMOUNT OF REPROTS RECEIVED: " + reports_.length);

        reports_.forEach(report => {
            console.log("REPORT: " + report.title);
            reports.build_report_row(report);
        });
    },

    /** Automatically load more reports once at bottom */

    // byId("report-anchor").scrollTop

}

reports.update_request();