import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import {Link, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectIsAuth} from "../../redux/slices/auth";
import {Navigate, useNavigate} from "react-router-dom";
import axios from "../../axios";

export const AddPost = () => {
    const navigate = useNavigate()
    const isAuth = useSelector(selectIsAuth);
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState('');
    const [text, setText] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isLoading, setIsLoading] = useState('false');
    const inputRefFile = useRef('null');
    const {id} = useParams();
    const isEdite = Boolean(id)


    const handleChangeFile = async (event) => {
        try {
            const formData = new FormData();
            const file = event.target.files[0];
            formData.append('image', file);
            const {data} = await axios.post('/upload', formData)
            setImageUrl(data.url)
        } catch (error) {
            console.log(error)
            alert('Не получилось заккгрузить файл')
        }
    };

    const onClickRemoveImage = () => {
        setImageUrl('')
    };

    const onChange = useCallback((value) => {
        setText(value);
    }, []);

    const onSubmit = async () => {
        try {
            setIsLoading('true');
            const fields = {title, text, tags, imageUrl};
            //через проверку если редактируем тогда update иначе создание
            const {data} = isEdite
                ? await axios.patch(`/posts/${id}`, fields)
                : await axios.post('posts', fields);
            //вытаскиваем айди статьи и если статья созданна перенаправляем в нее(usenavigate)
            //но до этого так же через проверку (это изменение или создание
            const _id = isEdite ? id : data._id;
            navigate(`/posts/${_id}`);
        } catch (error) {
            console.log(error)
            alert('Не удалось создать пост')
        }
    }

    const options = useMemo(
        () => ({
            spellChecker: false,
            maxHeight: '400px',
            autofocus: true,
            placeholder: 'Введите текст...',
            status: false,
            autosave: {
                enabled: true,
                delay: 1000,
            },
        }),
        [],
    );

    useEffect(() => {
        if (id) {
    axios.get(`/posts/${id}`).then(
        ({data}) => {
            setTitle(data.title);
            setText(data.text);
            setTags(data.tags);
            setImageUrl(data.imageUrl);
        }
    )
        }
    }, [])

    if (!isAuth) {
        return <Navigate to="/"/>
    }

    return (
        <Paper style={{padding: 30}}>
            <Button onClick={() => inputRefFile.current.click()} variant="outlined" size="large">
                Загрузить превью
            </Button>
            <input ref={inputRefFile} type="file" onChange={handleChangeFile} hidden/>
            {imageUrl && (
                <>
                    <Button variant="contained" color="error" onClick={onClickRemoveImage}>
                        Удалить
                    </Button>
                    <img className={styles.image} src={`http://localhost:3434${imageUrl}`} alt="Uploaded"/>
                </>
            )}
            <br/>
            <br/>
            <TextField
                classes={{root: styles.title}}
                variant="standard"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Заголовок статьи..."
                fullWidth
            />
            <TextField
                classes={{root: styles.tags}}
                variant="standard"
                placeholder="Тэги"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                fullWidth/>
            <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options}/>
            <div className={styles.buttons}>
                <Button onClick={onSubmit} size="large" variant="contained">
                    {isEdite ? 'Сохранить' : 'Опубликовать'}
                </Button>
                <Link to="/">
                    <Button size="large">Отмена</Button>
                </Link>
            </div>
        </Paper>
    );
};