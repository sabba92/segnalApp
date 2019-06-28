String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

var catMap = new Map();
var markers = { open: [], closed: [], signaled: [], banned: [] };
var clusters = { };

axios.post("http://localhost:3000/api/categories", {})
     .then((res) => {
          res.data.map(cat => catMap.set(cat._id, cat.name));
      })
      .catch(error => (alert(error)));

navigator.geolocation.getCurrentPosition(position => {
    var home = { lat: position.coords.latitude, lng: position.coords.longitude };
    var map = new google.maps.Map(
        document.getElementById('map'), { zoom: 9, center: home } );

    infowindow = new google.maps.InfoWindow();

    var homeM = createMarkerAndListener(home, map, google.maps.Animation.BOUNCE,
                  "/static/img/home.png", "<h3 class='text-primary'>Tu sei qui</h3>", infowindow);

    axios.post("http://localhost:3000/api/highlightings", { })
         .then((res) => {
             var hs = res.data;
             var markers = { open: [], closed: [], signaled: [], banned: [] };
             hs.map(h => {
                var pos = { lat: h.location.coordinates[0],
                            lng: h.location.coordinates[1] };
                var folder = "/static/img/";
                switch(h.status) {
                    case "open":
                        markers.open.push(createMarkerAndListener(pos, map, google.maps.Animation.DROP,
                                folder + "p" + h.category + ".png", createContent(h), infowindow));
                        break;
                    case "closed":
                        markers.closed.push(createMarkerAndListener(pos, map, google.maps.Animation.DROP,
                                folder + "pclo.png", createContent(h), infowindow));
                        break;
                    case "signaled":
                        markers.signaled.push(createMarkerAndListener(pos, map, google.maps.Animation.DROP,
                                folder + "p" + h.category + "sig.png", createContent(h), infowindow));
                        break;
                    case "banned":
                        markers.banned.push(createMarkerAndListener(pos, map, google.maps.Animation.DROP,
                                folder + "pban.png", createContent(h), infowindow));
                        break;
                }
             });
             setMarkers(markers, map);
          })
          .catch(error => (alert(error)));

      setControls(map);
});

function setMarkers(m, map) {
    this.markers = m;

    var stylesO = [ { height: 50, width: 36, textSize: 20,
                      url: "/static/img/pointer.png"}, ];
    var stylesS = [ { height: 50, width: 36, textSize: 20,
                      url: "/static/img/pointersig.png"}, ];
    var stylesB = [ { height: 50, width: 36, textSize: 20,
                      url: "/static/img/pointerban.png"}, ];
    var stylesC = [ { height: 50, width: 36, textSize: 20,
                      url: "/static/img/pointerclo.png"}, ];
    this.clusters.open = new MarkerClusterer(map, markers.open, { styles: stylesO, clusterClass: "open", ignoreHidden: true } );
    this.clusters.signaled = new MarkerClusterer(map, markers.signaled, { styles: stylesS, clusterClass: "signaled", ignoreHidden: true } );
    this.clusters.banned = new MarkerClusterer(map, markers.banned, { styles: stylesB, clusterClass: "banned", ignoreHidden: true } );
    this.clusters.closed = new MarkerClusterer(map, markers.closed, { styles: stylesC, clusterClass: "closed", ignoreHidden: true } );
}

function setControls(map) {
    var control = document.getElementById("mapControl");
    control.index = 1;
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);
}

function clickOnCheckbox(cat, ch)
{
    switch(cat) {
        case "open":
            this.markers.open.forEach(m => m.setVisible(ch));
            this.clusters.open.repaint();
            break;
        case "signaled":
            this.markers.signaled.forEach(m => m.setVisible(ch));
            this.clusters.signaled.repaint();
            break;
        case "banned":
            this.markers.banned.forEach(m => m.setVisible(ch));
            this.clusters.banned.repaint();
            break;
        case "closed":
            this.markers.closed.forEach(m => m.setVisible(ch));
            this.clusters.closed.repaint();
            break;
    }
}

function createContent(h) {
    var cat = catMap.get(h.category).capitalize();
    var img = (h.image === undefined) ? ("/static/img/i" + h.category + ".png") : ("/static/photos/" + h.image);
    var desc = h.desc;
    var to = "/details/" + h._id;
    var status;
    var bClass;
    switch (h.status) {
        case "open": status = "Segnalazione aperta";
            bClass = "primary";
            break;
        case "closed": status = "Segnalazione risolta";
            bClass = "success";
            break;
        case "signaled": status = "Segnalata come inappropriata";
            bClass = "warning";
            break;
      default: status = "Segnalazione chiusa perché non appropriata";
            bClass = "danger";
    }
    status = `<span class='badge badge-${bClass}'>${status}</span>`;
    var content = `
        <div class="card border-primary mb-3">
          <div class="row no-gutters">
            <div class="p-2 pt-4 col-md-3">
              <center>
                <img src="${img}" class="card-img">
              </center>
            </div>
            <div class="col-md-9">
              <div class="card-body">
                <h5 class="card-title">${cat}</h5>
                <p class="card-text">${desc}</p>
                <p class="card-text">
                  <h6>
                    ${status}
                    <span onclick="router.push({ path: '${to}' })" class='hand badge badge-primary'>Vedi dettagli</span>
                  </h6>
                </p>
              </div>
            </div>
          </div>
        </div>`;
    return content;
}

function createMarkerAndListener(position, map, animation, image, content, infowindow) {
    var marker = createMarker(position, map, animation, image, content);
    createListener(marker, infowindow);
    return marker;
}

function createMarker(position, map, animation, image, content) {
    return new google.maps.Marker({ position: position, map: map,
          animation: animation, icon: image, content: content } )
}

function createListener(marker, infowindow) {
    marker.addListener('click', function() {
        infowindow.setContent(marker.content);
        infowindow.open(marker.map, marker);
    });
}

//5d0c272da75f662a02a47487
//5d0c2760a75f662a02a47488
//5d0c279fa75f662a02a47489
//5d0c27c2a75f662a02a4748a
//5d0c27eba75f662a02a4748b
//5d0c2822a75f662a02a4748c
//5d0d4f6753db1a1a1557d1e9
