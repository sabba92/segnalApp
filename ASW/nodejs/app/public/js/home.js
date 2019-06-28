const Home = {
    template: `
    <div>
        <div class="container"> <br>
            <template v-if="!this.$session.exists()">
                <router-link class="btn btn-light text-primary" to="/login">Login</router-link>
                <router-link class="btn btn-light text-primary" to="/register">Registrati</router-link>
            </template>
            <template v-else>
                <router-link class="btn btn-light text-primary" to="/user">Torna alla tua pagina personale</router-link>
                <a class="btn btn-light text-primary" href="" @click.prevent="logout">Logout</a>
            </template>
        </div>
    </div>`,
    data: function () {
        return {
        }
    },
    methods: {
        logout: function() {
            this.$session.destroy();
            this.$router.push("/login");
        }
    }
}
