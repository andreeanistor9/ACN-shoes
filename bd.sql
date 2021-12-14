--
-- PostgreSQL database dump
--

-- Dumped from database version 14.0
-- Dumped by pg_dump version 14.0

-- Started on 2021-12-14 15:48:39
DROP TABLE IF EXISTS produse CASCADE;
DROP TYPE IF EXISTS categorie_produse CASCADE;
DROP TYPE IF EXISTS tipuri_produse CASCADE;

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 828 (class 1247 OID 16722)
-- Name: categorie_produse; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.categorie_produse AS ENUM (
    'pantofi sport',
    'ghete',
    'slapi si sandale'
);




--
-- TOC entry 831 (class 1247 OID 16730)
-- Name: tipuri_produse; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tipuri_produse AS ENUM (
    'femei',
    'barbati',
    'copii'
);




SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 210 (class 1259 OID 16738)
-- Name: produse; Type: TABLE; Schema: public; Owner: andreean
--

CREATE TABLE public.produse (
    id integer NOT NULL,
    nume character varying(50) NOT NULL,
    descriere text,
    tip_produs public.tipuri_produse DEFAULT 'femei'::public.tipuri_produse,
    categorie public.categorie_produse DEFAULT 'pantofi sport'::public.categorie_produse,
    pret numeric(8,2) NOT NULL,
    marime integer[],
    data_adaugare timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    culoare character varying(20),
    imagine character varying(300),
    materiale character varying[],
    disponibil_in_magazin boolean DEFAULT false NOT NULL
);




--
-- TOC entry 209 (class 1259 OID 16737)
-- Name: produse_id_seq; Type: SEQUENCE; Schema: public; Owner: andreean
--

CREATE SEQUENCE public.produse_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;




--
-- TOC entry 3325 (class 0 OID 0)
-- Dependencies: 209
-- Name: produse_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: andreean
--

ALTER SEQUENCE public.produse_id_seq OWNED BY public.produse.id;


--
-- TOC entry 3170 (class 2604 OID 16741)
-- Name: produse id; Type: DEFAULT; Schema: public; Owner: andreean
--

ALTER TABLE ONLY public.produse ALTER COLUMN id SET DEFAULT nextval('public.produse_id_seq'::regclass);


--
-- TOC entry 3319 (class 0 OID 16738)
-- Dependencies: 210
-- Data for Name: produse; Type: TABLE DATA; Schema: public; Owner: andreean
--

INSERT INTO public.produse (id, nume, descriere, tip_produs, categorie, pret, marime, data_adaugare, culoare, imagine, materiale, disponibil_in_magazin) VALUES (1, 'ACN Running 2xZ', 'Pantofi pentru alergat', 'barbati', 'pantofi sport', 249.99, '{41,42,43,45}', '2021-12-14 15:47:50.622146', 'negru', 'adidasi_alergat.jpg', '{panza,spuma}', true);
INSERT INTO public.produse (id, nume, descriere, tip_produs, categorie, pret, marime, data_adaugare, culoare, imagine, materiale, disponibil_in_magazin) VALUES (2, 'ACN Fitness 250', 'Pantofi pentru fitness', 'femei', 'pantofi sport', 289.65, '{36,37,38,39}', '2021-12-14 15:47:50.622146', 'albastru', 'adidasi_sport.jpg', '{panza,spuma}', true);
INSERT INTO public.produse (id, nume, descriere, tip_produs, categorie, pret, marime, data_adaugare, culoare, imagine, materiale, disponibil_in_magazin) VALUES (3, 'ACN Tennis 800', 'Pantofi pentru tenis', 'barbati', 'pantofi sport', 150.99, '{40,41,42,43,44}', '2021-12-14 15:47:50.622146', 'crem', 'adidasi_tennis.jpg', '{"material textil",piele,spuma}', false);
INSERT INTO public.produse (id, nume, descriere, tip_produs, categorie, pret, marime, data_adaugare, culoare, imagine, materiale, disponibil_in_magazin) VALUES (4, 'ACN Air 380', 'Pantofi sport de plimbare', 'barbati', 'pantofi sport', 420.50, '{40,42,43,45}', '2021-12-14 15:47:50.622146', 'alb', 'adidasi_barbati.jpg', '{panza,spuma}', true);
INSERT INTO public.produse (id, nume, descriere, tip_produs, categorie, pret, marime, data_adaugare, culoare, imagine, materiale, disponibil_in_magazin) VALUES (5, 'ACN CxT9', 'Pantofi sport de plimbare', 'femei', 'pantofi sport', 350.00, '{35,37,38,39}', '2021-12-14 15:47:50.622146', 'bleumarin', 'adidasi_dama.jpg', '{"material textil","piele intoarsa",spuma}', true);
INSERT INTO public.produse (id, nume, descriere, tip_produs, categorie, pret, marime, data_adaugare, culoare, imagine, materiale, disponibil_in_magazin) VALUES (6, 'ACN JDx280', 'Pantofi sport de plimbare', 'femei', 'pantofi sport', 510.90, '{35,36,38,39}', '2021-12-14 15:47:50.622146', 'albastru', 'adidasi_strada.jpg', '{piele,spuma}', true);
INSERT INTO public.produse (id, nume, descriere, tip_produs, categorie, pret, marime, data_adaugare, culoare, imagine, materiale, disponibil_in_magazin) VALUES (7, 'ACN B345', 'Tenisi pentru plimbare', 'copii', 'pantofi sport', 120.90, '{31,32,34,35}', '2021-12-14 15:47:50.622146', 'bleumarin', 'tenisi_baietei.jpg', '{panza,spuma}', true);
INSERT INTO public.produse (id, nume, descriere, tip_produs, categorie, pret, marime, data_adaugare, culoare, imagine, materiale, disponibil_in_magazin) VALUES (8, 'ACN F245', 'Tenisi bebelusi', 'copii', 'pantofi sport', 70.50, '{21,22,23,24}', '2021-12-14 15:47:50.622146', 'roz', 'tenisi_fetite.jpg', '{panza,spuma}', true);
INSERT INTO public.produse (id, nume, descriere, tip_produs, categorie, pret, marime, data_adaugare, culoare, imagine, materiale, disponibil_in_magazin) VALUES (9, 'ACN Canvas 500', 'Tenisi de panza pentru plimbari', 'barbati', 'pantofi sport', 350.90, '{41,42,43,45}', '2021-12-14 15:47:50.622146', 'verde', 'tenisi_unisex.jpg', '{panza,spuma}', true);
INSERT INTO public.produse (id, nume, descriere, tip_produs, categorie, pret, marime, data_adaugare, culoare, imagine, materiale, disponibil_in_magazin) VALUES (10, 'ACN BootM X', 'Ghete de iarna', 'barbati', 'ghete', 500.00, '{41,42,43,46}', '2021-12-14 15:47:50.622146', 'maro', 'ghete_barbati.jpg', '{piele,"material textil"}', true);
INSERT INTO public.produse (id, nume, descriere, tip_produs, categorie, pret, marime, data_adaugare, culoare, imagine, materiale, disponibil_in_magazin) VALUES (11, 'ACN BootF Y', 'Ghete de iarna', 'femei', 'ghete', 490.90, '{36,37,38,39,40}', '2021-12-14 15:47:50.622146', 'maro', 'ghete_dama.jpg', '{piele,"material textil"}', true);
INSERT INTO public.produse (id, nume, descriere, tip_produs, categorie, pret, marime, data_adaugare, culoare, imagine, materiale, disponibil_in_magazin) VALUES (12, 'ACN BootK X', 'Ghete de iarna', 'copii', 'ghete', 250.00, '{27,28,30,31}', '2021-12-14 15:47:50.622146', 'maro', 'ghete_copii.jpg', '{piele,"material textil"}', false);
INSERT INTO public.produse (id, nume, descriere, tip_produs, categorie, pret, marime, data_adaugare, culoare, imagine, materiale, disponibil_in_magazin) VALUES (13, 'ACN BootK W', 'Ghete de iarna', 'copii', 'ghete', 300.00, '{33,34,35,36}', '2021-12-14 15:47:50.622146', 'bleu', 'ghete_iarna.jpg', '{piele,"material textil"}', true);
INSERT INTO public.produse (id, nume, descriere, tip_produs, categorie, pret, marime, data_adaugare, culoare, imagine, materiale, disponibil_in_magazin) VALUES (14, 'ACN BootKaut', 'Ghete de toamna', 'copii', 'ghete', 220.90, '{32,33,34,35}', '2021-12-14 15:47:50.622146', 'maro', 'ghete_toamnaC.jpg', '{piele,"material textil"}', true);
INSERT INTO public.produse (id, nume, descriere, tip_produs, categorie, pret, marime, data_adaugare, culoare, imagine, materiale, disponibil_in_magazin) VALUES (15, 'ACN BootFaut', 'Ghete de toamna', 'femei', 'ghete', 400.00, '{36,37,38,40}', '2021-12-14 15:47:50.622146', 'maro', 'ghete_toamnaF.jpg', '{piele,"material textil"}', true);
INSERT INTO public.produse (id, nume, descriere, tip_produs, categorie, pret, marime, data_adaugare, culoare, imagine, materiale, disponibil_in_magazin) VALUES (16, 'ACN BootMaut', 'Ghete de toamna', 'barbati', 'ghete', 450.00, '{43,44,45}', '2021-12-14 15:47:50.622146', 'maro', 'ghete_toamnaB.jpg', '{piele,"material textil"}', true);
INSERT INTO public.produse (id, nume, descriere, tip_produs, categorie, pret, marime, data_adaugare, culoare, imagine, materiale, disponibil_in_magazin) VALUES (17, 'ACN Balance', 'Pantofi sport pentru plimbare', 'femei', 'pantofi sport', 345.90, '{37,39,40,41}', '2021-12-14 15:47:50.622146', 'mov', 'adidasi_mov.jpg', '{piele,"material textil",spuma}', false);
INSERT INTO public.produse (id, nume, descriere, tip_produs, categorie, pret, marime, data_adaugare, culoare, imagine, materiale, disponibil_in_magazin) VALUES (18, 'ACN BK500', 'Pantofi sport pentru plimbare', 'copii', 'pantofi sport', 55.90, '{31,32,33}', '2021-12-14 15:47:50.622146', 'negru', 'adidasi_negruK.jpg', '{"imitatie de piele","material textil",spuma}', true);
INSERT INTO public.produse (id, nume, descriere, tip_produs, categorie, pret, marime, data_adaugare, culoare, imagine, materiale, disponibil_in_magazin) VALUES (19, 'ACN NEO', 'Pantofi sport pentru plimbare', 'barbati', 'pantofi sport', 445.90, '{41,42,44,45}', '2021-12-14 15:47:50.622146', 'alb', 'adidasi_vara.jpg', '{piele,"material textil",spuma}', false);
INSERT INTO public.produse (id, nume, descriere, tip_produs, categorie, pret, marime, data_adaugare, culoare, imagine, materiale, disponibil_in_magazin) VALUES (20, 'ACN Crocs', 'Sandale pentru vara', 'copii', 'slapi si sandale', 40.50, '{29,30,32,33}', '2021-12-14 15:47:50.622146', 'albastru', 'sandale_copii.jpg', '{plastic,spuma}', true);
INSERT INTO public.produse (id, nume, descriere, tip_produs, categorie, pret, marime, data_adaugare, culoare, imagine, materiale, disponibil_in_magazin) VALUES (21, 'ACN FlipFlopsF', 'Slapi confortabili', 'femei', 'slapi si sandale', 50.50, '{36,37,38,39}', '2021-12-14 15:47:50.622146', 'verde', 'slapi_verzi.jpg', '{plastic,cauciuc}', true);
INSERT INTO public.produse (id, nume, descriere, tip_produs, categorie, pret, marime, data_adaugare, culoare, imagine, materiale, disponibil_in_magazin) VALUES (22, 'ACN FlipFlopsM', 'Slapi confortabili', 'barbati', 'slapi si sandale', 50.50, '{40,41,42,43,44,45,46}', '2021-12-14 15:47:50.622146', 'negru', 'slapi_negri.jpg', '{spuma}', true);


--
-- TOC entry 3326 (class 0 OID 0)
-- Dependencies: 209
-- Name: produse_id_seq; Type: SEQUENCE SET; Schema: public; Owner: andreean
--

SELECT pg_catalog.setval('public.produse_id_seq', 22, true);


--
-- TOC entry 3176 (class 2606 OID 16751)
-- Name: produse produse_nume_key; Type: CONSTRAINT; Schema: public; Owner: andreean
--




--
-- TOC entry 3178 (class 2606 OID 16749)
-- Name: produse produse_pkey; Type: CONSTRAINT; Schema: public; Owner: andreean
--

ALTER TABLE ONLY public.produse
    ADD CONSTRAINT produse_pkey PRIMARY KEY (id);


-- Completed on 2021-12-14 15:48:39

--
-- PostgreSQL database dump complete
--

