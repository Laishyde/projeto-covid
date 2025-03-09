// src/app/page.jsx
"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import styles from '../public/styles/page.module.scss';
import ReactModal from 'react-modal'; // Import ReactModal
import CovidChart from "./components/CovidChart";


export default function Home() {
    const [statesData, setStatesData] = useState([]);
    const [selectedState, setSelectedState] = useState('all');
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [countryData, setCountryData] = useState(null);
    const [isMounted, setIsMounted] = useState(false);
    const [dateUpdated, setDateUpdated] = useState(null);
  
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showAlert, setShowAlert] = useState(false); // State for custom 
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const [alertMessage, setAlertMessage] = useState(''); // State for alert 

    useEffect(() => {
        setIsMounted(true);

        const fetchStatesData = async () => {
            try {
                const response = await axios.get('https://covid19-brazil-api.vercel.app/api/report/v1');
                setStatesData(response.data.data);
            } catch (error) {
                console.error('Erro ao buscar dados estaduais:', error);
            }
        };

        const fetchCountries = async () => {
            try {
                const response = await axios.get('https://covid19-brazil-api.vercel.app/api/report/v1/countries');
                setCountries(response.data.data.map(country => country.country));
            } catch (error) {
                console.error('Erro ao buscar países:', error);
            }
        };

        fetchStatesData();
        fetchCountries();
    }, []);

    const { register, handleSubmit, formState: { errors }, reset } = useForm()

    const onSubmitForm = (data) => {
      console.log('Dados do formulário:', JSON.stringify(data));
      setAlertMessage('Formulário enviado com sucesso! Verifique o console.');
      setShowAlert(true);
      reset();
  };

  const closeAlert = () => {
      setShowAlert(false);
      setAlertMessage('');
  };

    useEffect(() => {
        const fetchCountryData = async () => {
            if (selectedCountry) {
                try {
                    const response = await axios.get(`https://covid19-brazil-api.vercel.app/api/report/v1/${selectedCountry}`);
                    setCountryData(response.data.data);
                    setDateUpdated(response.data.data.updated);
                } catch (error) {
                    console.error('Erro ao buscar dados do país:', error);
                    setCountryData(null);
                    setDateUpdated(null);
                }
            } else {
                setCountryData(null);
                setDateUpdated(null);
            }
        };

        fetchCountryData();
    }, [selectedCountry]);

    const getStatesStatus = () => {
        if (selectedState === 'all') {
            return (
                <div className={styles.cardContainer}>
                    {statesData.map(state => (
                        <div key={state.state} className={styles.card}>
                            <div className={styles.cardContent}>
                                <h6 className={styles.cardTitle}>{state.state}</h6>
                                <p>Casos: {state.cases}</p>
                                <p>Mortes: {state.deaths}</p>
                                <p>Suspeitos: {state.suspects}</p>
                            </div>
                        </div>
                    ))}
                </div>
            );
        } else {
            const state = statesData.find(state => state.state === selectedState);
            if (state) {
                return (
                    <div className={styles.cardContainer}>
                        <div key={state.state} className={styles.card}>
                            <div className={styles.cardContent}>
                                <h6 className={styles.cardTitle}>{state.state}</h6>
                                <p>Casos: {state.cases}</p>
                                <p>Mortes: {state.deaths}</p>
                                <p>Suspeitos: {state.suspects}</p>
                            </div>
                        </div>
                    </div>
                );
            } else {
                return <p>Estado não encontrado.</p>;
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Data não disponível';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            });
        } catch (error) {
            console.error('Erro ao formatar a data:', error);
            return 'Data inválida';
        }
    };

    const getCountryStatus = () => {
        if (countryData) {
            return (
                <div className={`${styles.card} ${styles.countryCard}`}>
                    <div className={styles.cardContent}>
                        <h5 className={styles.countryTitle}>{selectedCountry}</h5>
                        <p>Casos Confirmados: {countryData.confirmed}</p>
                        <p>Mortes: {countryData.deaths}</p>
                        <p>Recuperados: {countryData.recovered}</p>
                        <p>Data: {formatDate(dateUpdated)}</p>
                    </div>
                </div>
            );
        } else {
            return selectedCountry ? <p>Dados não encontrados para {selectedCountry}.</p> : null;
        }
    };

    const chartData = countryData ? [
        { name: 'Confirmados', value: countryData.confirmed },
        { name: 'Mortes', value: countryData.deaths },
        { name: 'Recuperados', value: countryData.recovered },
    ] : [];

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Estatísticas COVID-19</h1>
                
            </header>

            <div className={styles.banner}></div>
         
           {/* Exibir o GIF abaixo do banner */}
           <div>
            <h1 style={{ textAlign: "center", marginTop: "30px" }}></h1>
            <CovidChart />
        </div>
            <h4 className={styles.title}>Covid 19 no Brasil e no Mundo</h4>

            <div className={styles.formControl}>
                <label htmlFor="state" className={styles.inputLabel}>Selecione um Estado</label>
                <select
                    id="state"
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className={styles.select}
                >
                    <option value="all">Todos os Estados</option>
                    {statesData.map((state) => (
                        <option key={state.state} value={state.state}>
                            {state.state}
                        </option>
                    ))}
                </select>
            </div>

            {getStatesStatus()}

            <div className={styles.formControl}>
                <label htmlFor="country" className={styles.inputLabel}>Selecione um País</label>
                <select
                    id="country"
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className={styles.select}
                >
                    <option value="">Selecione um País</option>
                    {countries.map((country) => (
                        <option key={country} value={country}>
                            {country}
                        </option>
                    ))}
                </select>
            </div>

            {getCountryStatus()}

            {chartData.length > 0 && (
                <div className={`${styles.card} ${styles.chartCard}`}>
                    <div className={styles.cardContent}>
                        <h6 className={styles.cardTitle}>Dados COVID-19 em {selectedCountry}</h6>
                        <BarChart width={500} height={300} data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmitForm)} className={styles.form}>
                <div className={styles.gridContainer}>
                    <div className={styles.gridItem}>
                        <label htmlFor="state" className={styles.inputLabel}>Estado</label>
                        <input
                            type="text"
                            {...register('state', { required: 'Campo obrigatório' })}
                            className={`${styles.input} ${errors.state ? styles.inputError : ''}`}
                        />
                        {errors.state && <p className={styles.errorText}>{errors.state.message}</p>}
                    </div>

                    <div className={styles.gridItem}>
                        <label htmlFor="confirmed" className={styles.inputLabel}>Casos Confirmados</label>
                        <input
                            type="number"
                            {...register('confirmed', { required: 'Campo obrigatório' })}
                            className={`${styles.input} ${errors.confirmed ? styles.inputError : ''}`}
                        />
                        {errors.confirmed && <p className={styles.errorText}>{errors.confirmed.message}</p>}
                    </div>

                    <div className={styles.gridItem}>
                        <label htmlFor="deaths" className={styles.inputLabel}>Mortes</label>
                        <input
                            type="number"
                            {...register('deaths', { required: 'Campo obrigatório' })}
                            className={`${styles.input} ${errors.deaths ? styles.inputError : ''}`}
                        />
                        {errors.deaths && <p className={styles.errorText}>{errors.deaths.message}</p>}
                    </div>

                    <div className={styles.gridItem}>
                        <label htmlFor="recovered" className={styles.inputLabel}>Recuperados</label>
                        <input
                            type="number"
                            {...register('recovered', { required: 'Campo obrigatório' })}
                            className={`${styles.input} ${errors.recovered ? styles.inputError : ''}`}
                        />
                        {errors.recovered && <p className={styles.errorText}>{errors.recovered.message}</p>}
                    </div>

                    <div className={styles.gridItem}>
                        <label htmlFor="date" className={styles.inputLabel}>Data</label>
                        <input
                            type="date"
                            {...register('date', { required: 'Campo obrigatório' })}
                            className={`${styles.input} ${errors.date ? styles.inputError : ''}`}
                        />
                        {errors.date && <p className={styles.errorText}>{errors.date.message}</p>}
                    </div>
                </div>

                <button type="submit" className={styles.submitButton}>
                    Enviar Dados
                </button>
            </form>
               {/* Custom Alert */}
               {showAlert && (
                <div className={styles.alertOverlay}>
                    <div className={styles.alertBox}>
                        <p>{alertMessage}</p>
                        <button className={styles.alertButton} onClick={closeAlert}>
                            Ok
                        </button>
                    </div>
                </div>
            )}
            <footer className={styles.cabecalho}>
              <h2>Laís Cristina @2025</h2>
            </footer>
        </div>
    );
}
