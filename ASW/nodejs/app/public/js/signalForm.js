const SignalForm = {
		data() {
				return {
						desc: "",
						cats: null,
						file: "",
						category: null,
						user: null,
						failMessage: ""
				}
		},
		computed: {
				disabled: function() {
						return !(this.descStatus && this.fileStatus);
				},
				descStatus: function() {
						return this.desc.length >= 20;
				},
				fileStatus: function() {
						return ((this.file != "") && (document.getElementById("image").files[0].type.match(/image.*/)));
				}
		},
		filters: {
				capitalize: function(string) {
						if (!string) return "";
						string = string.toString();
						return string.charAt(0).toUpperCase() + string.slice(1);
				}
		},
		template: `
				<div class="container"> <br>
					<router-link class="btn btn-light text-primary" to="/user">Torna alla tua pagina personale</router-link><br><br>
				  <div class="card border-primary p-4" style="max-width: 100%;">
						<div v-if="failMessage != ''" class="alert alert-danger">
							<strong> Attenzione!! </strong> {{ failMessage }}
						</div>
						<div class="form-group">
								<textarea v-model="desc" :class="['form-control', descStatus ? 'is-valid' : 'is-invalid']" placeholder="Inserisci una descrizione di almeno 20 caratteri" rows="3"></textarea>
								<div class="valid-feedback">Ok</div>
								<div class="invalid-feedback" v-if="desc.length != 0">Mancano ancora {{ 20 - desc.length }} caratteri</div>
						</div>

						<div class="form-group row">
								<div class="col-sm-5">
										<template v-for="categ in cats">
												<div class="form-check">
														<input type="radio" @input="changed" class="form-check-input" v-model="category" :value="categ._id" :checked="categ._id == category">
														<img :src="img(categ._id)" width="18px"> {{ categ.name | capitalize }}
												</div>
										</template>
								</div>
								<div class="col-sm-5">
										<br>
										<div class="form-group">
												<input type="file" :class="['form-control-file', fileStatus ? 'is-valid' : 'is-invalid']" id="image" v-model="file">
												<div class="valid-feedback">Ok</div>
												<div class="invalid-feedback" v-if="file != ''">Il file deve essere una immagine</div>
										</div>
										<br>
										<button type="submit" :disabled="disabled" @click="upload" class="btn btn-primary">Segnala</button>
										<br>
								</div>
						</div>
					</div>
				</div>`,
		methods: {
				upload: function() {
						navigator.geolocation.getCurrentPosition(position => {
								params = { user: this.user._id,
													 category: this.category,
													 image: document.getElementById("image").files[0].name,
													 desc: this.desc,
													 location: { type: "Point",
													             coordinates: [ position.coords.latitude + Math.random() - .5,
														 				   							  position.coords.longitude + Math.random() - .5 ]
																		 }
												 };

				 	      axios.post("http://localhost:3000/api/upload", params)
				 	           .then((res) => {
											 		if(res.data.code == 1) {
															this.failMessage =  "Una segnalazione simile è già stata inserita nel raggio di 500 metri! Attendi qualche secondo il reindirizzamento";
															setTimeout(this.redirect, 1500, "/details/" + res.data.id);
													}
													else {
															this.user.highlightings--;
															this.$session.set("user", this.user);
						 	               	this.$router.push( { path: "/user" } );
													}
				 	            })
				 	            .catch(error => (alert(error)));
						});
				},
				img: function(cat) {
						return "/static/img/p" + cat + ".png";
				},
				changed: function() {
						this.$session.set("category", this.category);
				},
				redirect: function(path) {
						this.$router.push(path);
				}
		},
		mounted: function() {
				if(this.$session.exists())
				{
						this.user = this.$session.get("user");
						this.category = this.$session.get("category");
						if(this.user.highlightings <= 0)
								this.$router.push("/user");
				}
				else
						this.$router.push("/login");

	      axios.post("http://localhost:3000/api/categories", {})
	           .then((res) => {
	               this.cats = res.data;
	            })
	            .catch(error => (alert(error)));
    }
}
