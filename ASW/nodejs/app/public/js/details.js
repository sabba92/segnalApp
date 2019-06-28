const Details = {
		props: {
				id: Number
		},
		data() {
				return {
						highlighting: null,
						comments: null,
						reports: null
				}
		},
		template: `
				<div class="container"> <br>
						<my-card-high :btnComm="true" :h="highlighting" @newComment="comments.push(params)"></my-card-high>

						<template v-if="reports.length > 0">
								<my-card-rep :n="reports.length"></my-card-rep>
						</template>

						<template v-for="comment in comments">
								<my-card-comm :points="comment.points" :comment="comment.comment"></my-card-comm>
						</template>
				</div>`,
		mounted: function() {
				this.init();
    },
		watch: {
				id: function(newVal, oldVal) {
						this.init();
				}
		},
		methods: {
				init: function() {
					axios.post("http://localhost:3000/api/highlighting", { id: this.id } )
		           .then((res) => {
		               this.highlighting = res.data.h;
									 this.comments = res.data.comments;
									 this.reports = res.data.reports;
		            })
		            .catch(error => (alert(error)));
				}
		}
}
