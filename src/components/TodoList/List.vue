<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5">ToDo List</h3>
        <h2>{{editedIndex}}</h2>
        <v-card>
            <v-card-title>
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="search"
                    single-line
                    hide-details
                ></v-text-field>
                <v-spacer></v-spacer>
                <v-btn color="success" dark @click="dialog = true">Tambah</v-btn>
            </v-card-title>
            <v-data-table :headers="headers" :items="todos" :search="search">
                <template v-slot:[`item.priority`]="{item}">
                    <v-btn small class="mr-2" @click="showSB(item)"> <i class="fa fa-info-circle"></i></v-btn>
                    <v-snackbar 
                        v-model="snackbar"
                        :timeout="-1"
                        absolute
                        bottom
                        color="success"
                        outlined
                        right
                    >
                        {{ snackbarText }}
                    </v-snackbar>
                </template>
                <template v-slot:[`item.actions`]="{item}">
                    <v-btn small class="mr-2" @click="editItem(item)"> <i class="fa fa-pencil"></i> </v-btn>
                    <v-btn small @click="deleteItem(item)"> <i class="fa fa-trash" aria-hidden="true"></i></v-btn>
                </template>
            </v-data-table>
        </v-card>
        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">Form ToDo</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-text-field
                            v-model="itemEdit.task"
                            label="task"
                            required
                        ></v-text-field>
                        <v-select
                            v-model="itemEdit.priority"
                            :items="['Penting', 'Biasa', 'Tidak Penting']"
                            label="Priority"
                            required
                        ></v-select>
                        <v-textarea
                            v-model="itemEdit.note"
                            label="Note"
                            required
                        ></v-textarea>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancel"> Cancel </v-btn>
                    <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-main>
</template>

<script>
export default {
    name: "List",
    data(){
        return{
            search: null,
            dialog: false,
            snackbar: false,
            tes: null,
            snackbarText: null,
            headers:[
                {
                    text: "Task",
                    align: "start",
                    sortable: true,
                    value: "task",
                },
                {text: "Priority", value: "priority"},
                {text: "Note", value: "note"},
                {text: "Actions", value: "actions"},
            ],
            todos:[
                {
                    task: "Coding",
                    priority: "Penting",
                    note: "Code for your life",
                },
                {
                    task: "Gaming",
                    priority: "Tidak Penting",
                    note: "Wasting time",
                },
                {
                    task: "Masak",
                    priority: "Biasa",
                    note: "Indomi saat coding terbaik gan",
                },
            ],
            editedIndex: 0,
            itemEdit: {
                task: '', priority: '', note: ''
            },
            formTodo: {task: null, priority: null, note: null},
        };
    },
    methods:{
        
        save(){
            if(this.editedIndex> -1){
                Object.assign(this.todos[this.editedIndex],this.itemEdit)
                this.dialog = false;
            }else{
                this.todos.push( this.itemEdit),
                this.resetForm( );
                this.dialog = false;
            }
            this.close()
        },
        close () {
        this.dialog = false
        setTimeout(() => {
          this.itemEdit = Object.assign({}, this.formTodo)
          this.editedIndex = -1
        }, 300)
      },
        cancel(){
            this.resetForm();
            this.close()
        },
        resetForm(){
            this.formTodo = { task: null, priority: null, note: null };
        },
        deleteItem(item){
            const index = this.todos.indexOf(item)
            confirm('Yakin menghapus?') && this.todos.splice(index, 1);
            this.dialog=false;
        },
        editItem(item){
            this.editedIndex = this.todos.indexOf(item)
            this.itemEdit = Object.assign({}, item)
            this.dialog = true
        },
        showSB(item){
            this.editedIndex = this.todos.indexOf(item)
            console.log(this.editedIndex);
            this.snackbarText = Object.assign(this.todos[this.editedIndex],item.priority)
            this.snackbar = true
        },
    },
};
</script>
<style>
.fa-pencil{
    color: red;
}
.fa-trash{
    color:rgb(29, 243, 75);
}
</style>