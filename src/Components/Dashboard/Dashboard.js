import React, { useEffect, useState } from 'react';
import './Dashboard.css'
import { FaPlus,FaUndo,FaTimes,FaPen} from 'react-icons/fa';
import { useForm } from "react-hook-form";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });


const Dashboard = () => {
    const [allNotes,setAllNotes]=useState([])
    const [singleNote,setSingleNote]=useState(null)
    const {register, handleSubmit, watch, formState: { errors } } = useForm();
    const [open,setOpen] =useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
     setOpen(false)
    };


    const gettingNotes=()=>{
        fetch('https://reminders-task.hiring.durbin.live/notes')
        .then(res=>res.json())
        .then(data=>setAllNotes(data.data.notes))
    }

    useEffect(() => {
       gettingNotes();
    }, [])


    const onSubmit = data =>{
        const formData={
            title:data.title,
            description:data.description,
        }
        fetch('https://reminders-task.hiring.durbin.live/note',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
              },
              body: JSON.stringify(formData)
          })
          .then(res=>res.json())
          .then(data=>{
              setOpen(false);
              gettingNotes();
          })
    }


    const handleDelete=(id)=>{
        fetch(`https://reminders-task.hiring.durbin.live/note/${id}`,{
            method: 'DELETE'
        })
        .then(res=>res.json())
        .then(result=>{
            if (result) {
               gettingNotes();
            }
        })
    }


    const handleUpdate=(id)=>{
        fetch(`https://reminders-task.hiring.durbin.live/note/${id}`)
        .then(res=>res.json())
        .then(data=>setSingleNote(data.data.note))
    }

    const handleNoteUpdate=(event)=>{
        event.preventDefault()
        const updateDescription=event.target[0].value
        const id=singleNote.id

        fetch(`https://reminders-task.hiring.durbin.live/note/${id}`,{
            method:'PUT',
            headers:{
                'Content-Type':'application/json'
             },
            body: JSON.stringify({description:updateDescription})
          })
          .then(res=>res.json())
          .then(result=>{
              console.log(result)
          })
          setSingleNote(null)
     }
    
    return (
        <div>
            <div className='dashboard'>
                <div class="sidebar">
                    <button onClick={handleClickOpen} className='button'><FaPlus/> Add Note</button>
                    <br />
                    {
                             singleNote != null && 
                             <div>
                                 <form onSubmit={handleNoteUpdate}>
                                    <textarea className="update-area" type="text" name="description" onChange={(e)=>setSingleNote(e.target.value)} value={singleNote.description}></textarea>
                                    <br/>
                                    <button className='update-button' type="submit">Update Note</button>
                                </form>
                             </div>  
                    }
                </div>
                <div class="content">
                    <div className='note-list'>
                            {
                                allNotes.map(notes=>{
                                    const {title,description,created_at,id}=notes;
                                    return(
                                        <div>
                                            
                                            <div className='single-note'>
                                            <button onClick={()=>handleDelete(id)} className='del-btn' style={{float:'right'}}><FaTimes/></button>
                                                <h3>{title}</h3>
                                                <p>
                                                     {description}
                                                </p>
                                                    <p>{created_at}</p>
                                                    <button onClick={()=>handleUpdate(id)} className='update-btn'><FaPen size={20}/></button>
                                            </div>
                                         </div>
                                    )
                                })
                             }     
                         </div>

                    <Dialog
                        open={open}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-slide-title"
                        aria-describedby="alert-dialog-slide-description"
                       >
                        <DialogContent>
                        <button onClick={handleClose} style={{float:'right'}}><FaUndo/></button>
                            <form className='form' onSubmit={handleSubmit(onSubmit)}>
                                <input placeholder="Title" {...register("title")} required/> <br />
                                <textarea placeholder="Type note.." {...register("description")} required/> <br />
                                <input style={{float:'right'}} type="submit" value="Add Note"/>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};
export default Dashboard;