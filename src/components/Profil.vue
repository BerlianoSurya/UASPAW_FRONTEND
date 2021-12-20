<template>
    <v-main class="list test">
        <h3 class="text-h3" font-weight-medium mb-5> PROFIL </h3>
        <v-container class="test" bg fill-height grid-list-md text-xs-center>
            <v-flex d-flex justify-center>
                <v-layout wrap align-center>
                    <v-flex md12>
                            <v-card height="70%" width="100%" class="card-container">
                                <div>
                                    {{ user.name }}
                                </div>
                                <div>
                                    {{ user.email }}
                                </div>
                                <div>
                                    {{ user.alamat }}
                                </div>
                                <div>
                                    <v-btn color="success" dark @click="dialog =true"> Edit Profil </v-btn>
                                </div>
                            </v-card>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-container>
        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                        <span class="headline">Edit Profil</span>
                </v-card-title>
                <v-card-text>
                        <v-container>
                            <v-text-field v-model="form.name" label="Name" required></v-text-field>
                            <v-text-field v-model="form.alamat" label="Alamat" required></v-text-field>
                        </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancel">Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="setForm">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>{{ error_message }}</v-snackbar>
    </v-main>
</template>

<script>
    export default {
        name: "Profil",
        data() {
            return {
                showModal: false,
                inputType: 'Tambah',
                load: false,
                snackbar: false,
                error_message:'',
                userid:'',
                color: '',
                search: null,
                dialog: false,
                dialogConfirm: false,
                userform: new FormData,
                user:[],
                form: {
                    name: null,
                    email: null,
                    alamat: null,
                },
                deleteId:'',
                editId:''
            };
        },
        methods: {
            onFileChange(event){
                this.form.path = event.target.files[0];
            },
            setForm(){
                    this.update();
            },
            readData() {
                var url = this.$api + '/user/' + localStorage.getItem('id');
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.user = response.data.data;
                })
            },
            // simpan data Course
            
            // ubah data Course
            update() {
                let newData = {
                    name : this.form.name,
                    alamat: this.form.alamat,
                };
                var url = this.$api + '/user/' + localStorage.getItem('id');
                this.load = true;
                this.$http.put(url, newData, {
                    headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.error_message = response.data.message;
                    this.color = 'green';
                    this.snackbar =true;
                    this.load = false;
                            
                    this.close();
                    this.readData(); // baca data
                    this.resetForm();
                    this.inputType = 'Tambah';
                }).catch(error => {
                    this.error_message =error.response.data.message;
                    this.color = 'red';
                    this.snackbar = true;
                    this.load = false;
                });
            },
            editHandler(item) {
                this.editId = item.id;
                this.form.name = item.name;
                this.form.alamat = this.alamat;
                this.form.email = item.email;
                this.dialog= true;
            },
            
                close() {
                    this.dialog = false;
                    this.inputType = 'Tambah';
                    this.dialogConfirm = false;
                    this.readData();
                },
                cancel () {
                    this.resetForm();
                    this.readData();
                    this.dialog = false;
                    this.dialogConfirm = false;
                    this.inputType ='Tambah';
                },
                resetForm() {    
                    this.form = {
                            caption: null,
                            path: null,
                        };
                    },
                },
                computed: {
                    formTitle() {
                        return this.inputType;
                    },
                },
                mounted () {
                    this.readData();
                },
            };
</script>
<style scoped>
.profile div.profile-picture{
    width: 50px;
    height: 50px;
    background-size: cover;
    border-radius: 50%;
    overflow: hidden;
    border: 1px solid #eee;
    background-color: #ccc;
    text-align: center;
}
.profile img{
    width: 100%;
    height: 100%;
    max-height: 100% auto;
}
body{
    background: slateblue; /* not apply if you go from page-1 to page-2 */
   }
</style>