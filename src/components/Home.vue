<template style="background-color:blue;">
    <v-main class="list">
        <h3 class="text-h3" font-weight-medium mb-5> HOME </h3>
        <v-btn color="success" dark @click="dialog =true"> Posting </v-btn>
        
        <v-container bg fill-height grid-list-md text-xs-center>
            <v-flex d-flex justify-center>
                <v-layout wrap align-center>
                    <v-flex md12 v-for="item in feeds" :key="item.id">
                            <v-card height="70%" width="100%" class="cardview card-container">
                                <div v-if="test == item.user.id">
                                    <v-btn color="blue darken-1" text @click="editHandler(item)">Edit</v-btn>
                                    <v-btn color="blue darken-1" text @click="deleteHandler(item.id)">Delete</v-btn>
                                </div>
                                <div class="d-flex p-2">
                                    {{ item.user.name }}
                                </div>
                                <div>
                                    <img v-bind:src="item.path" class="img-fluid" height="300px" width="300px">
                                </div>
                                <div><p>{{item.path}}</p></div>
                                <div>
                                    {{ item.caption }}
                                </div>
                                <button id="show-modal" @click="komentar(item.id)">Lihat Komentar</button>
                            </v-card>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-container>
        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                        <span class="headline">Posting</span>
                </v-card-title>
                <v-card-text>
                        <v-container>
                            <v-text-field v-model="form.caption" label="Caption" required></v-text-field>
                            <div class="form-group">
                                <label for="description">Picture</label>
                                <input type="file" name="picture" class="form-control-file" id="picture" @change="onFileChange">
                            </div>
                        </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancel">Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="setForm">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialogConfirm" persistent max-width="400px">
                <v-card>
                    <v-card-title>
                            <span class="headline">Warning!</span>
                    </v-card-title>
                        <v-card-text>Anda Yakin ingin menghapus post ini?</v-card-text>
                    <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="dialogConfirm = false">Cancel</v-btn>
                            <v-btn color="blue darken-1" text @click="deleteData">Delete</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            
        <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>{{ error_message }}</v-snackbar>
    </v-main>
</template>

<script>
    export default {
        name: "Home",
        data() {
            return {
                test: localStorage.getItem('id'),
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
                feed: new FormData,
                feeds: [],
                users:[],
                form: {
                    caption: null,
                    path: null,
                },
                deleteId:'',
                editId:''
            };
        },
        methods: {
            

            komentar(id){
                localStorage.setItem('feedid', id)
                this.$router.push({
                    name: 'Komen',
                });
            },

            onFileChange(event){
                this.form.path = event.target.files[0];
            },
            setForm(){
                if(this.inputType !== 'Tambah'){
                    this.update();
                }else{
                    this.save();
                }
            },
            // Read Data Courses
            showbtn(){
                this.user.id == this.userid; 
            },
            readData() {
                var url = this.$api + '/feed';
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.feeds = response.data.data;
                    this.userid= localStorage.getItem('id');
                })
            },
            readUser() {
                var url = this.$api + '/user';
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.users = response.data.data;
                })
            },
            // simpan data Course
            save() {
                this.feed.append ('caption', this.form.caption);
                this.feed.append ('usersid', localStorage.getItem('id'));
                var url = this.$api + '/feed'
                this.load = true;
                this.$http.post(url, this.feed, {
                    headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                    }
            }).then(response => {
                this.error_message=response.data.message;
                this.color = "green";
                         
                this.snackbar =true;
                this.load = true; 
                this.close();
                this.readData(); // baca data
                this.resetForm();
            }).catch(error => {
                this.error_message=error.response.data.message;
                this.color = "red";
                this.snackbar = true;
                this.load = false;
                        
                });
            },
            // ubah data Course
            update() {
                let newData = {
                    caption : this.form.caption,
                    usersid: this.form.usersid,
                    path : this.form.path,
                };
                var url = this.$api + '/feed/' + this.editId;
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
            // Hapus data produk
            deleteData() {
                // menghapus data
                var url =this.$api + '/feed/' + this.deleteId;
                this.load =true;
                this.$http.delete(url, {
                    headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                    }
                }).then(response => {
                    this.error_message=response.data.message;
                    this.color = "green";
                                
                    this.snackbar= true;
                    this.load = false;
                    this.close();
                    this.readData(); // baca data
                    this.resetForm();
                    this.inputType = "Tambah";
                }).catch(error => {
                    this.error_message= error.response.data.message;
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                });
            },
            editHandler(item) {
                this.inputType = 'Ubah';
                this.editId = item.id;
                            
                this.form.caption = item.caption;
                this.form.usersid = this.userid;
                this.dialog= true;
            },
            deleteHandler(id) {
                    this.deleteId = id;
                    this.dialogConfirm = true;
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
                    this.readData();this.readUser();
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
</style>