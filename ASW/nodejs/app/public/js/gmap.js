const Gmap = {
    template: `
        <div class="container"><hr>
            <div id="map"></div>
            <div id="mapControl" class="pt-2">
                <div class="dropdown">
                  <button class="btn btn-light text-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Filtra
                  </button>
                  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <div class="container">
                      <div class="form-row pb-2">
                        <div class="form-check form-check-inline">
                          &nbsp;&nbsp;&nbsp;&nbsp;<input type="checkbox" class="form-check-input" @input="clickOnCheckbox('open', !open)" v-model="open">
                          <img src="/static/img/pointer.png" width="18px"/>
                        </div>
                        <div class="form-check form-check-inline">
                          &nbsp;&nbsp;&nbsp;&nbsp;<input type="checkbox" class="form-check-input" @input="clickOnCheckbox('signaled', !signaled)" v-model="signaled">
                          <img src="/static/img/pointersig.png" width="18px"/>
                        </div>
                      </div>
                      <div class="form-row">
                        <div class="form-check form-check-inline">
                          &nbsp;&nbsp;&nbsp;&nbsp;<input type="checkbox" class="form-check-input" @input="clickOnCheckbox('closed', !closed)" v-model="closed">
                          <img src="/static/img/pointerclo.png" width="18px"/>
                        </div>
                        <div class="form-check form-check-inline">
                          &nbsp;&nbsp;&nbsp;&nbsp;<input type="checkbox" class="form-check-input" @input="clickOnCheckbox('banned', !banned)" v-model="banned">
                          <img src="/static/img/pointerban.png" width="18px"/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
        </div>`,
    data: function () {
        return {
            open: true,
            closed: true,
            signaled: true,
            banned: true
        }
    }
}
