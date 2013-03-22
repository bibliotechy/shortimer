
add_markers = function(data) {
    for (obj in data) {
        add_marker(data[obj]);
    }
};

add_marker = function(obj) {
    var post_date = new Date(obj.post_date).toDateString();
    var marker =  L.marker([obj.location__latitude, obj.location__longitude], {riseOnHover : true}).addTo(map);
    marker.bindPopup("<b><a href='/job/" +obj.pk + "/'>" +obj.title + "</a></b>" +
        "<br />" + obj.employer__name +
        "<br />" + post_date);
    marker.on('mouseover', function() { this.openPopup(); });
    oldest_job = post_date; //for setting the oldest job
    return marker;
};

button_text = function(marker_count, oldest){

    return text = $('html').width() > 400 ? marker_count + " most recent jobs<br /> " +
            "Oldest : " + oldest + "<br />" +
            "<button class='btn' id='moreJobs'>Older jobs</button>" : "Older jobs";

};


var olderJobs = L.Control.extend({
    options: {
        position: 'topright'
    },
    onAdd: function (map) {
        // create the control container with a particular class name
        var container = L.DomUtil.create('div', 'btn');
        container.innerHTML = button_text(marker_count,oldest_job);
        L.DomEvent.addListener(container,'click',function() {
            $.ajax({
                url : "/map/more/" + marker_count + "/"
            }).done(
                function(data) {
                    add_markers(data);
                    marker_count += data.length;
                    container.innerHTML = button_text(marker_count, oldest_job);
                }
            )});
        return container;
    }
});

var subjectJobs = L.Control.extend({
    options : {
        position : 'topright'
    },
    onAdd: function(map) {
        var container = L.DomUtil.create('div','subjects-control');
        container.innerHTML =
            "<input type='text' autocomplete='off' id='subject-search' class='input-small search-query' data-provide='typeahead' data-items='4'>" +
            "<button id='add-subject' class='btn'>Add</button>";
        return container;
        }
});