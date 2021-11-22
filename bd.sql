--
-- PostgreSQL database dump
--

-- Dumped from database version 14.0
-- Dumped by pg_dump version 14.0

-- Started on 2021-11-22 14:58:21

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 210 (class 1259 OID 16396)
-- Name: produse; Type: TABLE; Schema: public; Owner: andreean
--

CREATE TABLE public.produse (
    id integer NOT NULL,
    nume character varying(50) NOT NULL,
    pret integer NOT NULL,
    online boolean DEFAULT true NOT NULL
);


ALTER TABLE public.produse OWNER TO andreean;

--
-- TOC entry 209 (class 1259 OID 16395)
-- Name: produse_id_seq; Type: SEQUENCE; Schema: public; Owner: andreean
--

ALTER TABLE public.produse ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.produse_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 3307 (class 0 OID 16396)
-- Dependencies: 210
-- Data for Name: produse; Type: TABLE DATA; Schema: public; Owner: andreean
--

INSERT INTO public.produse (id, nume, pret, online) OVERRIDING SYSTEM VALUE VALUES (1, 'ceva', 100, true);
INSERT INTO public.produse (id, nume, pret, online) OVERRIDING SYSTEM VALUE VALUES (2, 'ceva2', 200, false);
INSERT INTO public.produse (id, nume, pret, online) OVERRIDING SYSTEM VALUE VALUES (3, 'altceva', 300, true);
INSERT INTO public.produse (id, nume, pret, online) OVERRIDING SYSTEM VALUE VALUES (4, 'ceva', 500, true);


--
-- TOC entry 3313 (class 0 OID 0)
-- Dependencies: 209
-- Name: produse_id_seq; Type: SEQUENCE SET; Schema: public; Owner: andreean
--

SELECT pg_catalog.setval('public.produse_id_seq', 4, true);


--
-- TOC entry 3166 (class 2606 OID 16400)
-- Name: produse produse_pkey; Type: CONSTRAINT; Schema: public; Owner: andreean
--

ALTER TABLE ONLY public.produse
    ADD CONSTRAINT produse_pkey PRIMARY KEY (id);


-- Completed on 2021-11-22 14:58:23

--
-- PostgreSQL database dump complete
--

