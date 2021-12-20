<template>
    <v-main class="list">
        <h3 class="text-h3" font-weight-medium mb-5> Komen </h3>
        <v-btn color="success" dark @click="dialog =true"> Add Komen </v-btn>
        
        <v-container bg fill-height grid-list-md text-xs-center>
            <v-flex d-flex justify-center>
                <v-layout wrap align-center>
                    <v-flex md12 v-for="item in komens" :key="item.id">
                            <v-card height="70%" width="100%" class="card-container">
                                 <div>
                                    {{ item.user.name }}
                                </div>
                                <div>
                                    {{ item.komen }}
                                </div>
                                <div v-if="test == item.user.id">
                                    <v-btn color="blue darken-1" text @click="editHandler(item)">Edit</v-btn>
                                    <v-btn color="blue darken-1" text @click="deleteHandler(item.id)">Delete</v-btn>
                                </div>
                            </v-card>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-container>
        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                        <span class="headline">Komen</span>
                </v-card-title>
                <v-card-text>
                        <v-container>
                            <v-text-field v-model="form.komen" label="Komen" required></v-text-field>
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
                        <v-card-text>Anda Yakin ingin menghapus komen ini?</v-card-text>
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
                komen: new FormData,
                komens: [],
                users:[],
                form: {
                    komen: null,
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
                if(this.inputType !== 'Tambah'){
                    this.update();
                }else{
                    this.save();
                }
            },
            // Read Data Courses
            showbtn(){
                this.komen.id === this.userid; 
            },
            readData() {
                var url = this.$api + '/komen/' + localStorage.getItem('feedid');
                this.$http.get(url, {
                    headers: {
                        'Authorization' : 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(response => {
                    this.komens = response.data.data;
                })
            },
            // simpan data Course
            save() {
                this.komen.append ('komen', this.form.komen);
                this.komen.append ('usersid', localStorage.getItem('id'));
                this.komen.append ('feedid', localStorage.getItem('feedid'));
                var url = this.$api + '/komen'
                this.load = true;
                this.$http.post(url, this.komen, {
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
                    komen : this.form.komen,
                };
                var url = this.$api + '/komen/' + this.editId;
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
                var url =this.$api + '/komen/' + this.deleteId;
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
                            
                this.form.komen = item.komen;
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
                            komen: null,
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
</style>