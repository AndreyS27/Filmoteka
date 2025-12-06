import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const baseApiUrl = "https://localhost:7181/api";

const FilmDetailsPage = () => {
    const {id} = useParams();
    const [film, setFilm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFilm = async () => {
            try {
                const response = await axios.get(`${baseApiUrl}/films/${id}`);
                setFilm(response.data);
            } catch (err) {
                setError('Не удалось получить информацию о фильме');
                console.error('Film details error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFilm();
    }, [id]);

    if (loading) {
        return <div className="container mt-5">Загрузка...</div>;
    }

    if (error) {
        return <div className="container mt-5 text-danger">{error}</div>;
    }

    return(
        <div className="container-lg">
            <div className="row">
                <div className="col-3">
                    <img className="img-fluid" src="https://placeholder.apptor.studio/20/15/product1.png" alt=""></img>
                </div>
                <div className="col">
                    <h1>{film.name}</h1>
                    <p>{film.description}</p>
                    {film.year}
                    {film.duration}
                    {film.country}
                    {film.genre}
                    {film.director}
                    {film.posterPath}
                </div>
            </div>
            <div className="">
                <h4>Рецензии зрителей</h4>
            </div>
        </div>
    );
};

export default FilmDetailsPage;