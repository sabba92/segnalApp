const UserHome = {
    data: function() {
        return {
            cats: null,
						level: null,
						points: 0,
						completed: 0,
						rep: 0,
						user: null,
						active: "home",
						hList: null,
						cList: null,
            rList: null,
            adminLists: { },
        }
    },
		computed: {
				pointPerc: function() {
						if (this.level != null)
								return (this.points * 100. / this.level.max);
						return 0;
				},
				highPerc: function() {
						var max = this.level._id * 2;
						return { n: this.user.highlightings + "/" + max, w: this.user.highlightings / max * 100 };
				},
				commPerc: function() {
						var max = this.level._id * 10;
						return { n: this.user.comments + "/" + max, w: this.user.comments / max * 100 };
				}
		},
		methods: {
				logout: function() {
						this.$session.destroy();
						this.$router.push("/login");
				},
				home: function() {
						this.active = "home";
            this.$session.set("active", "home")
				},
				comments: function() {
						this.active = "comments";
            this.$session.set("active", "comments")
				},
				highlightings: function() {
						this.active = "highlightings";
            this.$session.set("active", "highlightings")
				},
				admin: function() {
						this.active = "admin";
            this.$session.set("active", "admin")
				}
		},
    template: `
    <div>
        <div class="container"> <br>
						<div class="card border-primary mb-3" style="max-width: 100%;">
								<div class="card-header">
										<ul class="nav nav-tabs card-header-tabs">
												<li class="nav-item">
														<a href="" :class="['nav-link', (active == 'home') ? 'active': '']" @click.prevent="home">Home</a>
												</li>
												<li class="nav-item">
														<a href="" :class="['nav-link', (active == 'highlightings') ? 'active': '']" @click.prevent="highlightings">Segnalazioni</a>
												</li>
												<li class="nav-item">
														<a href="" :class="['nav-link', (active == 'comments') ? 'active': '']" @click.prevent="comments">Commenti</a>
												</li>
                        <li class="nav-item">
														<router-link class="nav-link" to="/">Mappa</router-link>
												</li>
												<li class="nav-item" v-if="this.user.admin == true">
														<a class="nav-link btn-danger" href="" @click.prevent="admin">Admin area</a>
												</li>
                        <li class="nav-item">
														<a class="nav-link" href="" @click.prevent="logout">Logout</a>
												</li>
										</ul>
								</div>
								<div class="card-body">
          				<div class="row no-gutters">
            				<div class="col-md-6">
												<center><h5 class="text-primary">Ciao {{ user.username }}!!</h5></center>
												<div class="row no-gutters">
														<div class="col-md-4">
																<my-star :id="1" :title="'Livello'" :n="level._id"></my-star>
														</div>
														<div class="col-md-4">
																<my-star :id="2" :title="'Reputazione'" :n="rep"></my-star>
														</div>
														<div class="col-md-4">
																<my-star :id="3" :title="'Completate'" :n="completed"></my-star>
														</div>
												</div>
            				</div>
            				<div class="col-md-6">
              					<div class="card-body">
														<my-bar :title="'Punteggio'" :n="points" :w="pointPerc" :striped="true" :color="''"></my-bar>
														<my-bar :title="'Segnalazioni rimaste'" :n="highPerc.n" :w="highPerc.w"></my-bar>
														<my-bar :title="'Potere rimasto'" :n="commPerc.n" :w="commPerc.w"></my-bar>
												</div>
            				</div>
          				</div>
								</div>
        		</div>

						<template v-if="active == 'home'">
		            <template v-for="categ in cats">
		                <my-card-home :cat="categ"></my-card-home>
		            </template>
						</template>
						<template v-else-if="active == 'highlightings'">
		            <template v-for="h in hList">
		                <my-card-high :btnDet="true" :h="h" @newComment="cList.push(params)"></my-card-high>
		            </template>
						</template>
						<template v-else-if="active == 'comments'">
            <template v-for="c in cList">
                <my-card-high :btnDet="true" :h="c.details[0]" :c="c"></my-card-high>
            </template>
            <template v-for="r in rList">
                <my-card-high :btnDet="true" :h="r.details[0]" :r="r"></my-card-high>
            </template>
						</template>
            <template v-else-if="active == 'admin'">
		            <template v-for="h in adminLists.reports">
		                <my-card-high :h="h.details" :n="h.count"></my-card-high>
		            </template>
                <template v-for="h in adminLists.highlightings">
		                <my-card-high :h="h" :btnClose="true"></my-card-high>
		            </template>
						</template>
        </div>
    </div>`,
    mounted: function() {
				if(this.$session.exists())
        {
						this.user = this.$session.get("user");
            if(this.$session.get("active") !== undefined)
                this.active = this.$session.get("active");
        }
				else
						this.$router.push("/login");

	      axios.post("http://localhost:3000/api/categories", {})
	           .then((res) => {
	               this.cats = res.data;
	            })
	            .catch(error => (alert("1"+error)));

				axios.post("http://localhost:3000/api/userUploads", { user: this.user._id } )
	           .then((res) => {
	               this.hList = res.data.h;
								 this.cList = res.data.c;
                 this.rList = res.data.r;
	            })
	            .catch(error => (alert("2"+error)));

				axios.post("http://localhost:3000/api/getPoints", { user: this.user._id } )
				.then((res) => {
					  this.points = res.data.points;
						this.rep = res.data.rep;
						this.completed = res.data.completed;
					  axios.post("http://localhost:3000/api/levelPoints", { points: this.points } )
							 .then((res) => {
									 this.level = res.data;
                   axios.post("http://localhost:3000/api/updateUser",
                              { user: this.user._id,
                                level: this.level._id } )
           	           .then((res) => {
           	               this.user = res.data.user;
                           this.$session.set("user", this.user);
           	            })
           	            .catch(error => (alert("3"+error)));
								})
								.catch(error => (alert("4"+error)));
				 })
				 .catch(error => (alert("5"+error)));

         if(this.user.admin == true)
            axios.post("http://localhost:3000/api/getReports", { } )
            .then((res) => {
                this.adminLists.reports = res.data.r;
                this.adminLists.highlightings = res.data.l;
            })
            .catch(error => alert("6"+error));
    }
}
//ObjectId("5d0bbef2760dff10e7558196")
//sabba2 5d0bbefc760dff10e7558197
