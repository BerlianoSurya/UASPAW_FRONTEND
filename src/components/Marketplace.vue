<template>
    <v-main class="list">
        <h3 class="text-h3" font-weight-medium mb-5> Marketplace </h3>
        <v-btn color="success" dark @click="dialog =true"> Posting </v-btn>
        
        <v-container bg fill-height grid-list-md text-xs-center>
            <v-flex d-flex justify-center>
                <v-layout wrap align-center>
                    <v-flex md12 v-for="item in markets" :key="item.id">
                            <v-card height="70%" width="100%" class="card-container">
                                <div class="d-flex flex-row-reverse p-2" v-if="test == item.user.id">
                                    <v-btn color="blue darken-1" text @click="editHandler(item)">Edit</v-btn>
                                    <v-btn color="blue darken-1" text @click="deleteHandler(item.id)">Delete</v-btn>
                                </div>
                                <div class="d-flex p-2">
                                    {{ item.user.name }}
                                </div>
                                <div class="d-flex p-2">
                                    {{ item.nama_barang }}
                                </div>
                                <div class="d-flex p-2">
                                    Rp. {{ item.harga }}
                                </div>
                                <div>
                                    <img v-bind:src="item.path_barang" class="img-fluid" height="300px" width="300px">
                                </div>
                                <div><p>{{item.path_barang}}</p></div>
                                <div>
                                    {{ item.deskripsi }}
                                </div>
                                <button id="show-modal" @click="showModal = true">Lihat Komentar</button>
                            </v-card>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-container>
        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                        <span class="headline">Marketplace</span>
                </v-card-title>
                <v-card-text>
                        <v-container>
                            <v-text-field v-model="form.nama_barang" label="nama_barang" required></v-text-field>
                            <v-text-field v-model="form.deskripsi" label="deskripsi" required></v-text-field>
                            <v-text-field v-model="form.harga" label="harga" required></v-text-field>
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
        name: "Marketplace",
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
                market: new FormData,
                markets: [],
                users:[],
                form: {
                    nama_barang: null,
                    deskripsi: null,
                    harga: null,
                },
                deleteId:'',
                editId:''
            };
        },
        methods: {
            onFileChange(event){
                this.form.path_barang = event.target.files[0];
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
                this.user.id === this.userid;
            },
            readData() {
                var url = this.$api + '/market';
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.markets = response.data.data;
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
                this.market.append ('nama_barang', this.form.nama_barang);
                this.market.append ('deskripsi', this.form.deskripsi);
                this.market.append ('harga', this.form.harga);
                this.market.append ('usersid', localStorage.getItem('id'));
                var url = this.$api + '/market'
                this.load = true;
                this.$http.post(url, this.market, {
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
                    nama_barang : this.form.nama_barang,
                    deskripsi : this.form.deskripsi,
                    harga : this.form.harga,
                    usersid: this.form.usersid,
                };
                var url = this.$api + '/market/' + this.editId;
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
                var url =this.$api + '/market/' + this.deleteId;
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
                this.form.nama_barang = item.nama_barang;
                this.form.deskripsi = item.deskripsi;
                this.form.harga = item.harga;
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
                            nama_barang: null,
                            deskripsi: null,
                            harga: null,
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