function isEmail(str) {
		var re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
		return re.test(str);
}

Vue.component("my-icon", {
		props: ['icon'],
		computed: {
				iconClass: function() {
						return "fa fa-" + this.icon;
				}
		},
		template:
				"<span :class='iconClass'></span>"
});

const LoginForm = {
		props: ['action'],
		data() {
				return {
						email: "",
						password: "",
						password2: "",
						user: "",
						failMessage: ""
				}
		},
		computed: {
				emailStatus: function() {
						return isEmail(this.email);
				},
				passwordStatus: function() {
						return this.password.length >= 8;
				},
				password2Status: function() {
						return this.password2.length >= 8 &&
									 this.password2 == this.password;
				},
				userStatus: function() {
						return this.user.length >= 4;
				},
				loginDisabled: function() {
						return !(this.emailStatus && this.passwordStatus)
				},
				registerDisabled: function() {
						return !(!this.loginDisabled && this.password2Status && this.userStatus);
				},
		},
		template: `
				<div class="container"> <br>
				  <router-link class="btn btn-light text-primary" to="/">Torna alla home</router-link><br><br>
				  <div class="card border-primary mb-3">
						<div class="card-body">
							<div v-if="failMessage != ''" class="alert alert-danger">
								<strong> Attenzione!! </strong> {{ failMessage }}
							</div>
							<div class="form-group">
								<my-icon :icon="'envelope-o'"> </my-icon>
								<input type="text" v-model="email" :class="['form-control', emailStatus ? 'is-valid' : 'is-invalid']" placeholder="E-mail"/>
								<div class="valid-feedback">Ok</div>
								<div class="invalid-feedback" v-if="email.length != 0">Inserisci un indirizzo valido</div>
							</div>

							<div class="form-group">
	              <my-icon :icon="'lock'"> </my-icon>
	              <input type="password" v-model="password" :class="['form-control', passwordStatus ? 'is-valid' : 'is-invalid']" placeholder="Password" />
								<div class="valid-feedback">Ok</div>
								<div class="invalid-feedback" v-if="password.length != 0">Almeno 8 caratteri</div>
	          	</div>

							<template v-if="action == 'register'">
								<div class="form-group">
										<my-icon :icon="'key'"> </my-icon>
										<input type="password" v-model="password2" :class="['form-control', password2Status ? 'is-valid' : 'is-invalid']" placeholder="Ripeti password" />
										<div class="valid-feedback">Ok</div>
										<div class="invalid-feedback" v-if="password2.length != 0">Le due password devono coincidere</div>
								</div>

								<div class="form-group">
										<my-icon :icon="'user-o'"> </my-icon>
										<input type="text" v-model="user" :class="['form-control', userStatus ? 'is-valid' : 'is-invalid']" placeholder="Username" />
										<div class="valid-feedback">Ok</div>
										<div class="invalid-feedback" v-if="user.length != 0">Almeno 4 caratteri</div>
								</div>

								<button class="btn btn-primary" @click="register" :disabled="registerDisabled"> Register </button>
								<router-link class="btn btn-primary" to="/login">Gi&agrave; registrato?</router-link>
							</template>

							<template v-else>
								<button class="btn btn-primary" @click="login" :disabled="loginDisabled"> Login </button>
								<router-link class="btn btn-primary" to="/register">Non ancora registrato?</router-link>
						  </template>
						</div>
					</div>
				</div>`,
		mounted: function() {
			if(this.$session.exists())
					this.$router.push("/user");
		},
		methods: {
				login: function() {
						axios.post("http://localhost:3000/api/login",
											 { email: this.email, password: this.password } )
								 .then((response) => {
								 	   if (response.data.code != 3)
										     this.setError(response.data.message);
										 else {
											 	 this.$session.start();
												 this.$session.set("user", response.data.message);
												 router.push( { path: "user/" } );
										 }
									})
								  .catch(error => (this.setError(response.data.message)));
				},
				register: function() {
						axios.post("http://localhost:3000/api/register",
									     { email: this.email,
												 password: this.password,
												 username: this.user } )
								 .then((response) => {
									   if (response.data.code != 3)
										     this.setError(response.data.message);
										 else
										 		 router.push("/login");
								 })
								 .catch(error => (this.setError(response.data.message)));
				},
				setError: function(message) {
						this.failMessage = message;
						setTimeout(this.clearError, 2500);
				},
				clearError: function() {
						this.failMessage = "";
				}
		}
}
