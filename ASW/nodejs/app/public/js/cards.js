Vue.component("my-card-home", {
		props: ['cat'],
    data: function() {
        return {
            high: null
        }
    },
    mounted: function() {
        this.high = this.$session.get('user').highlightings;
    },
		computed: {
				img: function() {
						return "/static/img/i" + this.cat._id + ".png";
				},
		},
    filters: {
				capitalize: function(string) {
						if (!string) return "";
						string = string.toString();
						return string.charAt(0).toUpperCase() + string.slice(1);
				}
		},
		methods: {
				signal: function() {
						this.$session.set("category", this.cat._id);
						this.$router.push("/signal");
				}
		},
		template: `
        <div class="card border-primary mb-3" style="max-width: 100%;">
          <div class="row no-gutters">
            <div class="m-4 col-md-2">
              <img :src="img" class="card-img">
            </div>
            <div class="col-md-6">
              <div class="card-body">
                <h5 class="card-title">{{ cat.name | capitalize }}</h5>
                <p class="card-text">{{ cat.desc | capitalize }}</p>
              </div>
            </div>
            <div class="p-5 col-md-2">
							  <button class="btn btn-primary" @click="signal" :disabled="high <= 0">Segnala</button>
            </div>
          </div>
        </div>`
});

Vue.component("my-card-high", {
    props: {
        h: { type: Object,
             default: null },
			  c: { type: Object,
             default: null },
				r: { type: Object,
             default: null },
			  n: { type: Number,
					   default: 0 },
        btnDet: { type: Boolean,
                  default: false },
        btnComm: { type: Boolean,
                   default: false },
			  btnClose: { type: Boolean,
                    default: false }
    },
		data: function() {
				return {
						cat: null,
            commentForm: false,
            message: false,
						repMessage: false,
						commented: false
				}
		},
		mounted: function() {
				axios.post("http://localhost:3000/api/findComment",
										{ user: this.$session.get("user")._id,
											highlighting : this.h._id } )
						 .then((res) => {
								this.commented = (res.data.count != 0);
						 })
						 .catch(error => (alert(error)));
		},
		computed: {
				img: function() {
            if (this.h == null) return "";
						return (this.h.image === undefined) ?
						       			("/static/img/i" + this.h.category + ".png") :
									 			("/static/photos/" + this.h.image);
												return "";
				},
        getCat: function() {
           axios.post("http://localhost:3000/api/categoryById", { id: this.h.category } )
               .then((res) => {
                   this.cat = res.data.name;
                })
                .catch(error => (alert(error)));
            return this.cat;
        },
				to: function() {
            if (this.h == null) return "";
            return "/details/" + this.h._id;
				},
        desc: function() {
            if (this.h == null) return "";
            return h.desc;
        },
				status: function() {
						var bClass;
						var status;
            if (this.h == null) return "<span></span>";
						switch (this.h.status) {
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
						return `<span class='badge badge-${bClass}'>${status}</span>`;
				},
        commDisabled: function() {
						return (this.repDisabled ||
                    this.$session.get("user").comments <= 0);
				},
				repDisabled: function() {
						if (this.h === null)
								return true;
						return ((this.h.status != "open" &&
									 	 this.h.status != "signaled") ||
										 !this.$session.exists() ||
                     this.h.user == this.$session.get("user")._id ||
									   this.commented);
				}
		},
    methods: {
        comment: function() {
            this.commentForm = true;
						this.$session.set("highlighting", this.h._id);
						//this.$router.push("/comment");
        },
        closeComm: function(params) {
						this.commented = true;
            this.commentForm = false;
            this.message = true;
            setTimeout(this.clear, 1500);
						this.$emit("newComment", params);
        },
        clear: function() {
            this.message = false;
						this.repMessage = false;
						this.$router.go();
        },
				ban: function() {
						axios.post("http://localhost:3000/api/ban",
											{ highlighting: this.h._id, user: this.h.user } )
			           .then((res) => {
											this.$router.push("/details/" + this.h._id);
			            })
			            .catch(error => (alert(error)));
				},
				close: function() {
						axios.post("http://localhost:3000/api/close",
											{ highlighting: this.h._id } )
								 .then((res) => {
											this.$router.push("/details/" + this.h._id);
									})
									.catch(error => (alert(error)));
				},
        report: function() {
						params = { user: this.$session.get("user")._id,
											 highlighting: this.h._id
										 };

						axios.post("http://localhost:3000/api/report", params)
								 .then((res) => {
											 this.commented = true;
					             this.repMessage = true;
											 this.h.status = "signaled";
					             setTimeout(this.clear, 2500);
									})
									.catch(error => (alert(error)));
        }
    },
		filters: {
				capitalize: function(string) {
						if (string == null) return "";
						string = string.toString();
						return string.charAt(0).toUpperCase() + string.slice(1);
				}
		},
		template: `
        <div class="card border-primary mb-3" style="max-width: 100%;">
					<div class="row no-gutters">
						<div class="m-4 col-md-2">
							<img :src="img" class="card-img">
						</div>
						<div :class="[(c !== null || r !== null) ? 'col-md-4' : 'col-md-6']">
							<div class="card-body">
								<h5 class="card-title">{{ getCat | capitalize }}</h5>
								<p v-if="c !== null" class="card-text"> Commento: {{ c.comment | capitalize }}</p>
								<p v-else-if="r !== null" class="card-text"> Hai giudicato non appropriata questa segnalazione </p>
								<p v-else class="card-text">{{ h.desc | capitalize }}</p>
								<p class="card-text"><h6><span v-html="status"></span>
								<span v-if="n != 0" class='badge badge-danger'>{{ n }}</span></h6></p>
							</div>
						</div>
						<div class="pt-4 col-md-2" v-if='c !== null'>
								<my-star :id="1" :n="c.points" :title="''"></my-star>
						</div>
						<div class="pt-4 col-md-2" v-else-if='r !== null'>
								<my-star :id="4" :n="'!'" :title="''"></my-star>
						</div>
						<div :class="['pt-5', ' text-center', (c !== null || r !== null) ? 'col-md-2' : 'col-md-3']" v-if='btnDet'>
								<router-link class="btn btn-primary" :to="to">Vedi dettagli</router-link>
						</div>
						<div class="p-3 pt-4 col-md-3 text-center" v-if='n != 0'>
								<router-link class="btn btn-primary" :to="to">Vedi dettagli</router-link><br>
								<button class="mt-2 btn btn-danger" @click="ban">Chiudi</button>
						</div>
						<div class="p-3 pt-4 col-md-3 text-center" v-if='btnClose'>
								<router-link class="btn btn-primary" :to="to">Vedi dettagli</router-link><br>
								<button class="mt-2 btn btn-success" @click="close">Chiudi</button>
						</div>
            <div class="m-1 mt-3 col-md-3 text-center" v-if='btnComm'>
								<button class="mt-2 btn btn-primary" :disabled="commDisabled" @click="comment">Lascia un commento</button>
								<button class="mt-2 btn btn-danger" :disabled="repDisabled" @click="report">Segnala come inappropriata</button>
						</div>
					</div>
          <my-comment-form :h="h._id" v-if="commentForm == true" @commOK="closeComm"></my-comment-form>
          <div class="container">
            <div v-if="message" class="alert alert-success">
              <strong> Commento inserito </strong>
            </div>
						<div v-if="repMessage" class="alert alert-danger">
              <strong> Segnalazione inserita </strong>
            </div>
          </div>
				</div>`
});

Vue.component("my-card-comm", {
		props: {
				points: Number,
				comment: String,
				idH: { type: Number,
				 			 default: null }
		},
		computed: {
				to: function() {
						if(this.idH === null) return "";
						return "/details/" + this.idH;
				}
		},
		template: `
        <div class="card border-primary mb-3" style="max-width: 100%;">
          <div class="row no-gutters">
            <div class="m-4 col-md-2">
                <my-star :id="1" :n="points" :title="''"></my-star>
            </div>
            <div class="col-md-6">
              <div class="card-body">
                <p class="card-text">{{ comment }}</p>
              </div>
            </div>
						<div class="p-3 pt-4 col-md-3" v-if='idH != null'>
								<router-link class="btn btn-primary" :to="to">Dettagli segnalazione</router-link>
						</div>
          </div>
        </div>`
});

Vue.component("my-card-rep", {
		props: {
				idH: { type: Number,
				       default: null },
				n: { type: Object,
				       default: "" },
		},
		computed: {
				text: function() {
						if(this.idH == null)
								return "Questa segnalazione è stata giudicata non appropriata da " +
										    ((this.n == 1) ? "un utente" : (this.n + " utenti"));
						return "Hai giudicato non appropriata questa segnalazione";
				}
		},
		template: `
        <div class="card border-primary mb-3" style="max-width: 100%;">
          <div class="row no-gutters">
            <div class="m-4 col-md-2">
                <my-star :id="4" :n="n + '!'" :title="''"></my-star>
            </div>
            <div class="col-md-6">
              <div class="card-body">
                <p class="card-text">{{ text }}</p>
              </div>
            </div>
						<div class="p-3 pt-4 col-md-3" v-if='idH != null'>
								<router-link class="btn btn-primary" :to="'/details/' + idH">Dettagli segnalazione</router-link>
						</div>
          </div>
        </div>`
});
