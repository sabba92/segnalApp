Vue.component("my-bar", {
		props: {
				title: { type: String },
				n: { type: String },
				w: {type: Number },
				striped: { type: Boolean, default: false },
				color: { type: String, default: null }
		},
		computed: {
				style: function() {
						return "width: " + this.w + "%;";
				},
				classes: function() {
						return "progress-bar " +
									 ((this.striped == true) ? "progress-bar-striped " : "") +
									 ((this.color == null) ? this.computeColor() : this.color);
				}
		},
		methods: {
				computeColor: function() {
						if (this.w > 30)
								return "bg-success";
						if (this.w > 10)
								return "bg-warning";
						return "bg-danger";
				}
		},
		template: `
				<div>
						{{ title }}:
						<div class="progress">
								<div :class="classes" :style="style">
										{{ n }}
								</div>
						</div>
				</div>`
});

Vue.component("my-star", {
		props: ['id', 'n', 'title'],
		computed: {
				img: function() {
						return "/static/img/star" + this.id + ".png";
				},
				content: function() {
						if (this.n < 100)
								return ("<h2><b>" + this.n + "</b></h2>");
						return ("<h4><b>" + this.n + "</b></h4>");
				}
		},
		template: `
				<center>
						<h6> {{ title }} </h6>
						<div class="overlay-image">
		 						<img class="image" :src="img" />
		 						<div class="text" v-html="content"></div>
						</div>
				</center>`
});

Vue.component("my-comment-form", {
	  props: ['h'],
		data: function() {
				return {
						desc: "",
						points: 1,
						user: null
				}
		},
		computed: {
				descStatus: function() {
						return this.desc.length >= 20;
				},
				disabled: function() {
						return !this.descStatus;
				}
		},
		methods: {
				comment: function() {
						params = { user: this.user._id,
						  				 highlighting: this.h,
							  			 points: this.points,
								  		 comment: this.desc,
									   };

					  axios.post("http://localhost:3000/api/comment", params)
						  	 .then((res) => {
							  			this.user.comments -= this.points;
								  		this.$session.set("user", this.user);
											this.$emit("commOK", params);
								  })
								  .catch(error => (alert(error)));
				}
		},
		mounted: function() {
				if(this.$session.exists())
				{
						this.user = this.$session.get('user');
						if(this.user.comments <= 0)
								this.$router.push("/user");
				}
				else
						this.$router.push("/login");
    },
		template: `
				<div class="container"> <br>
					<div class="card border-primary p-4" style="max-width: 100%;">
						<div class="row no-gutters">
							<div class="col-md-7">
								<div class="form-group">
										<textarea v-model="desc" :class="['form-control', descStatus ? 'is-valid' : 'is-invalid']" placeholder="Inserisci un commento di almeno 20 caratteri" rows="4"></textarea>
										<div class="valid-feedback">Ok</div>
										<div class="invalid-feedback" v-if="desc.length != 0">Mancano ancora {{ 20 - desc.length }} caratteri</div>
								</div>
							</div>
							<div class="col-md-4">
								<div class="form-group" style="margin-left: 30px">
									Punteggio:
									<select class="form-control" v-model="points">
											<template v-for="n in this.user.comments">
													<option :value="n">{{n}}</option>
											</template>
									</select>
									<button class="btn btn-primary mt-2" @click="comment">Commenta</button>
								</div>
							</div>
						</div>
					</div>
					<br>
				</div>`
});
