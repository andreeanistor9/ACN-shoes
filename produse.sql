--
-- PostgreSQL database dump
--

-- Dumped from database version 14.2
-- Dumped by pg_dump version 14.2

-- Started on 2022-04-29 12:54:42

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
-- TOC entry 827 (class 1247 OID 16397)
-- Name: categorie_produse; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.categorie_produse AS ENUM (
    'pantofi sport',
    'ghete',
    'slapi si sandale'
);


ALTER TYPE public.categorie_produse OWNER TO postgres;

--
-- TOC entry 830 (class 1247 OID 16404)
-- Name: roluri; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.roluri AS ENUM (
    'admin',
    'moderator',
    'comun'
);


ALTER TYPE public.roluri OWNER TO postgres;

--
-- TOC entry 833 (class 1247 OID 16412)
-- Name: tipuri_produse; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tipuri_produse AS ENUM (
    'femei',
    'barbati',
    'copii'
);


ALTER TYPE public.tipuri_produse OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 209 (class 1259 OID 16419)
-- Name: accesari; Type: TABLE; Schema: public; Owner: andreean
--

CREATE TABLE public.accesari (
    id integer NOT NULL,
    ip character varying(100) NOT NULL,
    user_id integer,
    pagina character varying(500) NOT NULL,
    data_accesare timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.accesari OWNER TO andreean;

--
-- TOC entry 210 (class 1259 OID 16425)
-- Name: accesari_id_seq; Type: SEQUENCE; Schema: public; Owner: andreean
--

CREATE SEQUENCE public.accesari_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.accesari_id_seq OWNER TO andreean;

--
-- TOC entry 3357 (class 0 OID 0)
-- Dependencies: 210
-- Name: accesari_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: andreean
--

ALTER SEQUENCE public.accesari_id_seq OWNED BY public.accesari.id;


--
-- TOC entry 211 (class 1259 OID 16426)
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


ALTER TABLE public.produse OWNER TO andreean;

--
-- TOC entry 212 (class 1259 OID 16435)
-- Name: produse_id_seq; Type: SEQUENCE; Schema: public; Owner: andreean
--

CREATE SEQUENCE public.produse_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.produse_id_seq OWNER TO andreean;

--
-- TOC entry 3358 (class 0 OID 0)
-- Dependencies: 212
-- Name: produse_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: andreean
--

ALTER SEQUENCE public.produse_id_seq OWNED BY public.produse.id;


--
-- TOC entry 213 (class 1259 OID 16436)
-- Name: utilizatori; Type: TABLE; Schema: public; Owner: andreean
--

CREATE TABLE public.utilizatori (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    nume character varying(100) NOT NULL,
    prenume character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    parola character varying(500) NOT NULL,
    data_adaugare timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    culoare_chat character varying(50) DEFAULT 'black'::character varying,
    rol public.roluri DEFAULT 'comun'::public.roluri NOT NULL,
    problema_vedere boolean DEFAULT false,
    fotografie character varying(300) NOT NULL,
    cod character varying(200),
    confirmat_mail boolean DEFAULT false
);


ALTER TABLE public.utilizatori OWNER TO andreean;

--
-- TOC entry 214 (class 1259 OID 16446)
-- Name: utilizatori_id_seq; Type: SEQUENCE; Schema: public; Owner: andreean
--

CREATE SEQUENCE public.utilizatori_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.utilizatori_id_seq OWNER TO andreean;

--
-- TOC entry 3359 (class 0 OID 0)
-- Dependencies: 214
-- Name: utilizatori_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: andreean
--

ALTER SEQUENCE public.utilizatori_id_seq OWNED BY public.utilizatori.id;


--
-- TOC entry 3184 (class 2604 OID 16447)
-- Name: accesari id; Type: DEFAULT; Schema: public; Owner: andreean
--

ALTER TABLE ONLY public.accesari ALTER COLUMN id SET DEFAULT nextval('public.accesari_id_seq'::regclass);


--
-- TOC entry 3189 (class 2604 OID 16448)
-- Name: produse id; Type: DEFAULT; Schema: public; Owner: andreean
--

ALTER TABLE ONLY public.produse ALTER COLUMN id SET DEFAULT nextval('public.produse_id_seq'::regclass);


--
-- TOC entry 3195 (class 2604 OID 16449)
-- Name: utilizatori id; Type: DEFAULT; Schema: public; Owner: andreean
--

ALTER TABLE ONLY public.utilizatori ALTER COLUMN id SET DEFAULT nextval('public.utilizatori_id_seq'::regclass);


--
-- TOC entry 3346 (class 0 OID 16419)
-- Dependencies: 209
-- Data for Name: accesari; Type: TABLE DATA; Schema: public; Owner: andreean
--

COPY public.accesari (id, ip, user_id, pagina, data_accesare) FROM stdin;
1905	::1	\N	/cos-virtual	2022-01-25 19:07:07.99775
1906	::1	\N	/produse_cos	2022-01-25 19:07:08.317849
1907	::1	\N	/index	2022-01-25 19:07:09.160116
1908	::1	\N	/resurse/css/galerie-animata.css	2022-01-25 19:07:09.911105
1909	::1	\N	/login	2022-01-25 19:07:20.844273
1910	::1	38	/index	2022-01-25 19:07:20.959609
1911	::1	38	/resurse/css/galerie-animata.css	2022-01-25 19:07:21.487986
1912	::1	38	/logout	2022-01-25 19:07:28.801525
1913	::1	\N	/logout	2022-01-25 19:07:52.204408
1914	::1	\N	/	2022-01-25 19:07:55.589122
1915	::1	\N	/resurse/css/galerie-animata.css	2022-01-25 19:07:56.093888
1916	::1	\N	/login	2022-01-25 19:08:04.715203
1917	::1	24	/index	2022-01-25 19:08:04.817456
1918	::1	24	/resurse/css/galerie-animata.css	2022-01-25 19:08:05.345927
1919	::1	24	/logout	2022-01-25 19:08:10.608052
1920	::1	\N	/logout	2022-01-25 19:19:53.581451
1921	::1	\N	/	2022-01-25 19:19:55.420474
1922	::1	\N	/resurse/css/galerie-animata.css	2022-01-25 19:19:55.927937
\.


--
-- TOC entry 3348 (class 0 OID 16426)
-- Dependencies: 211
-- Data for Name: produse; Type: TABLE DATA; Schema: public; Owner: andreean
--

COPY public.produse (id, nume, descriere, tip_produs, categorie, pret, marime, data_adaugare, culoare, imagine, materiale, disponibil_in_magazin) FROM stdin;
1	ACN Running 2xZ	Pantofi pentru alergat	barbati	pantofi sport	249.99	{41,42,43,45}	2021-12-14 15:47:50.622146	negru	adidasi_alergat.jpg	{panza,spuma}	t
2	ACN Fitness 250	Pantofi pentru fitness	femei	pantofi sport	289.65	{36,37,38,39}	2021-12-14 15:47:50.622146	albastru	adidasi_sport.jpg	{panza,spuma}	t
3	ACN Tennis 800	Pantofi pentru tenis	barbati	pantofi sport	150.99	{40,41,42,43,44}	2021-12-14 15:47:50.622146	crem	adidasi_tennis.jpg	{"material textil",piele,spuma}	f
4	ACN Air 380	Pantofi sport de plimbare	barbati	pantofi sport	420.50	{40,42,43,45}	2021-12-14 15:47:50.622146	alb	adidasi_barbati.jpg	{panza,spuma}	t
5	ACN CxT9	Pantofi sport de plimbare	femei	pantofi sport	350.00	{35,37,38,39}	2021-12-14 15:47:50.622146	bleumarin	adidasi_dama.jpg	{"material textil","piele intoarsa",spuma}	t
6	ACN JDx280	Pantofi sport de plimbare	femei	pantofi sport	510.90	{35,36,38,39}	2021-12-14 15:47:50.622146	albastru	adidasi_strada.jpg	{piele,spuma}	t
7	ACN B345	Tenisi pentru plimbare	copii	pantofi sport	120.90	{31,32,34,35}	2021-12-14 15:47:50.622146	bleumarin	tenisi_baietei.jpg	{panza,spuma}	t
8	ACN F245	Tenisi bebelusi	copii	pantofi sport	70.50	{21,22,23,24}	2021-12-14 15:47:50.622146	roz	tenisi_fetite.jpg	{panza,spuma}	t
9	ACN Canvas 500	Tenisi de panza pentru plimbari	barbati	pantofi sport	350.90	{41,42,43,45}	2021-12-14 15:47:50.622146	verde	tenisi_unisex.jpg	{panza,spuma}	t
10	ACN BootM X	Ghete de iarna	barbati	ghete	500.00	{41,42,43,46}	2021-12-14 15:47:50.622146	maro	ghete_barbati.jpg	{piele,"material textil"}	t
11	ACN BootF Y	Ghete de iarna	femei	ghete	490.90	{36,37,38,39,40}	2021-12-14 15:47:50.622146	maro	ghete_dama.jpg	{piele,"material textil"}	t
12	ACN BootK X	Ghete de iarna	copii	ghete	250.00	{27,28,30,31}	2021-12-14 15:47:50.622146	maro	ghete_copii.jpg	{piele,"material textil"}	f
13	ACN BootK W	Ghete de iarna	copii	ghete	300.00	{33,34,35,36}	2021-12-14 15:47:50.622146	bleu	ghete_iarna.jpg	{piele,"material textil"}	t
14	ACN BootKaut	Ghete de toamna	copii	ghete	220.90	{32,33,34,35}	2021-12-14 15:47:50.622146	maro	ghete_toamnaC.jpg	{piele,"material textil"}	t
15	ACN BootFaut	Ghete de toamna	femei	ghete	400.00	{36,37,38,40}	2021-12-14 15:47:50.622146	maro	ghete_toamnaF.jpg	{piele,"material textil"}	t
16	ACN BootMaut	Ghete de toamna	barbati	ghete	450.00	{43,44,45}	2021-12-14 15:47:50.622146	maro	ghete_toamnaB.jpg	{piele,"material textil"}	t
17	ACN Balance	Pantofi sport pentru plimbare	femei	pantofi sport	345.90	{37,39,40,41}	2021-12-14 15:47:50.622146	mov	adidasi_mov.jpg	{piele,"material textil",spuma}	f
18	ACN BK500	Pantofi sport pentru plimbare	copii	pantofi sport	55.90	{31,32,33}	2021-12-14 15:47:50.622146	negru	adidasi_negruK.jpg	{"imitatie de piele","material textil",spuma}	t
19	ACN NEO	Pantofi sport pentru plimbare	barbati	pantofi sport	445.90	{41,42,44,45}	2021-12-14 15:47:50.622146	alb	adidasi_vara.jpg	{piele,"material textil",spuma}	f
20	ACN Crocs	Sandale pentru vara	copii	slapi si sandale	40.50	{29,30,32,33}	2021-12-14 15:47:50.622146	albastru	sandale_copii.jpg	{plastic,spuma}	t
21	ACN FlipFlopsF	Slapi confortabili	femei	slapi si sandale	50.50	{36,37,38,39}	2021-12-14 15:47:50.622146	verde	slapi_verzi.jpg	{plastic,cauciuc}	t
22	ACN FlipFlopsM	Slapi confortabili	barbati	slapi si sandale	50.50	{40,41,42,43,44,45,46}	2021-12-14 15:47:50.622146	negru	slapi_negri.jpg	{spuma}	t
\.


--
-- TOC entry 3350 (class 0 OID 16436)
-- Dependencies: 213
-- Data for Name: utilizatori; Type: TABLE DATA; Schema: public; Owner: andreean
--

COPY public.utilizatori (id, username, nume, prenume, email, parola, data_adaugare, culoare_chat, rol, problema_vedere, fotografie, cod, confirmat_mail) FROM stdin;
1	andreean2009	Nistor	Andreea	andreeann2021@gmail.com	29a35b2c0b53bcf681fee319a090534882b2f4beb591d302981548cdfc655d26	2022-01-19 22:32:48.628501	red	admin	f	admin-img.jpg	admin-smecher	t
20	prof27250	Gogulescu	Gogu	profprofprof007@gmail.com	e9b1b52bc10f02579484d5c6faceca28eafecc161dcf6033a24ee69b8f95786e	2022-01-20 13:55:12.706354	red	comun	t		202204135512/prof27250/JSTMTXGMGJBVXPQPSHXLVKTWLGZFFZRKNSPHBZDKPQWFPKFQFZMMMCNDXFFHPSZDXPWCKCLTHBNRKYGPDGGNZXQBHTXPTDLQBHSQ	t
8	andreean9	Nistor	Andreea	andreeann2021@gmail.com	Aa123.	2022-01-20 00:16:38.82525	red	admin	f	admin-img.jpg	admin-smecher	f
22	prof87980	Gogulescu	Gogu	profprofprof007@gmail.com	e9b1b52bc10f02579484d5c6faceca28eafecc161dcf6033a24ee69b8f95786e	2022-01-20 14:01:04.190307	red	comun	t		2022041414/prof87980/TPQBJRXRZYQNHKPHQCNDHPZDDJWSTKDWPTLRTHPLPSNYTYHHLDCYZJKPHMSWJMBXYNVJHRTKQGHQJXHSHHMXNNVJDYNHGNSZFHQT	f
17	prof7463	Gogulescu	Gogu	profprofprof007@gmail.com	e9b1b52bc10f02579484d5c6faceca28eafecc161dcf6033a24ee69b8f95786e	2022-01-20 12:50:31.135322	green	comun	t		202204125031/prof7463/PTGDGPVWLMDKNLFMMRDTFYHYHHNDDWGDMYQZVNTQDHZMFRCZDXXCKFGMMMNVHXDYHNTRJMPKBJFYKDQGHXVMQFPMQBLWYLXQNCJN	f
27	prof3310	Gogulescu	Gogu	profprofprof007@gmail.com	e9b1b52bc10f02579484d5c6faceca28eafecc161dcf6033a24ee69b8f95786e	2022-01-20 16:11:48.959049	red	comun	\N		202204161148/prof3310/TKVQYZLBRVXWLXKTWKGDHVKJLQTXFVLKDCXVYNFQNPWMFTPMGWRTXWHSSWSVXYKWCZCRDNGZCQNRDWTDCYNCLXRRYMGJBJNKXCPL	f
16	prof49481	Gogulescu	Gogu	profprofprof007@gmail.com	e9b1b52bc10f02579484d5c6faceca28eafecc161dcf6033a24ee69b8f95786e	2022-01-20 12:47:20.718212	blue	comun	t		202204124720/prof49481/JLLHKXVMQDLNPRYYLPRTTTWJVZHKHCBYNHPBXYGZTYLKRTWLXVVGSVXMKKDBZPXKJWFPHXLXPNSPMQKZQVPPQDCJGNLZZNZVJSQB	f
18	prof92296	Gogulescu	Gogu	profprofprof007@gmail.com	e9b1b52bc10f02579484d5c6faceca28eafecc161dcf6033a24ee69b8f95786e	2022-01-20 13:24:39.366682	blue	comun	t		202204132439/prof92296/HRHZSJLFRSWJPPBKPVDXCBGLLKDBWVQVGXFVTJGDMXDMYKDTJMTBHJKFXGXHCLPCVJRCGRCBMLCTQJBVPBLRNGVMBFVWQLLBHXBS	f
28	prof44733	Gogulescu	Gogu	profprofprof007@gmail.com	e9b1b52bc10f02579484d5c6faceca28eafecc161dcf6033a24ee69b8f95786e	2022-01-20 16:13:35.751978	red	comun	\N		202204161335/prof44733/CJKRCBYVNBFBCKRCPDNXXSXRPXPSJKTVPXBMSQWGYNTNBQWYVPFTCKJGPXWZNQVDDRBMPNRDGBPDRGNWNQRXDHBWYWQMGCGGGQDY	f
15	utilizator1	Utilizatorul	Smecher	utilizsmecher@gmail.com	e9b1b52bc10f02579484d5c6faceca28eafecc161dcf6033a24ee69b8f95786e	2022-01-20 12:47:03.624898	green	comun	t		20220412473/utilizator1/QFVFYDXTSGWJLSTXPQBFFQBCNPDBQYTCCVHCTBKDYYVBQXXPZLSDRNLPMFVCNFTQLZZKCNHWBVDGTRYHXCNGDZXKXJGDNLNYXLPN	t
19	prof42006	Gogulescu	Gogu	profprofprof007@gmail.com	e9b1b52bc10f02579484d5c6faceca28eafecc161dcf6033a24ee69b8f95786e	2022-01-20 13:54:59.407617	green	comun	t		202204135459/prof42006/PZMDGNZKJLVTTJJFTJJVLJCHBHWNQLGYFRJHKJVYYFYTTPVGVSBPHYZFQSJBCFCFPSTQYFPKVQMHDXTSJQVXVZWSNRVMKDPFQNNB	f
33	prof5346	Gogulescu	Gogu	profprofprof007@gmail.com	e9b1b52bc10f02579484d5c6faceca28eafecc161dcf6033a24ee69b8f95786e	2022-01-20 23:41:02.506401	green	comun	\N	/poze_uploadate/prof5346/poza.jpg	20220423412/prof5346/YRKMSFMSSVFNGZDHQYSRCQFGQRXPRKFKHMCFLFYJTHSJDDDGFDLLTXSXPWTMHMQDQXRXJLJXCCFMCQQWYCKJPRGWGSNKTPQZKMMF	f
24	andreea	Nistor	Andreea	andreeanistor9600@gmail.com	081daadbe90e6b41afd5b4132d2772d4f813b83d39020a7dcd023050db0450bb	2022-01-20 16:01:18.791546	green	comun	\N		20220416118/andreea/VYVHTJBVJSRHVLSLCQMRZBSJLVBDCQSSTGCMTDBCRTHTLTJRNSWLKLTNBWTKQQNVSCHRPVPJJKQWCRRYYWHXQSCLZZHNYGKRNPPV	t
34	admin	Admin	Admin	profprofprof007@gmail.com	e9b1b52bc10f02579484d5c6faceca28eafecc161dcf6033a24ee69b8f95786e	2022-01-21 18:22:59.347505	red	comun	\N	/poze_uploadate/admin/poza.jpg	202205182259/admin/ZRNSLYMNJXNXNTPSYHHSPQXKVJDFKJRYWHWNQSFRFTVNRFXBNLSCLXLVVVHFKMFBFKWFFVLKKLHZWPFSJGQZXPPYFKZMKTSBKJMQ	f
23	prof2529	Gogulescu	Gogu	profprofprof007@gmail.com	e9b1b52bc10f02579484d5c6faceca28eafecc161dcf6033a24ee69b8f95786e	2022-01-20 14:44:34.059973	red	comun	t		202204144434/prof2529/NZJFRPZSXGLBVCVPPNLKQLMPGJYPMJQYNNLXCRHDFGRSTVHQLDRGFGTWSJDZLDXFXTKZCFBZJJXKHCZYWKBQKZVSYSRTBHYWCGMJ	t
31	prof97436	Gogulescu	Gogu	profprofprof007@gmail.com	081daadbe90e6b41afd5b4132d2772d4f813b83d39020a7dcd023050db0450bb	2022-01-20 17:30:35.164178	red	comun	\N		202204173035/prof97436/LCTRDWZFZZLQHRTLVXVKCTWGPPMRMZYJMPSJNRJMBTKWKVBMTRDMPBWYRSXNQTWLLVJCQZMPQVFDVXKYSLHWNGFSWJQVHQMZHPRY	t
26	prof55823	Gogulescu	Gogu	profprofprof007@gmail.com	e9b1b52bc10f02579484d5c6faceca28eafecc161dcf6033a24ee69b8f95786e	2022-01-20 16:11:39.805727	red	comun	\N		202204161139/prof55823/PKJXLLDNYLCSNLYNDCYDGDQTHLJYPDNWDHHRPRJSZGMMVGCHRTQTJDTDNWHLWHPWSPTBQFKQPPSXWYZXGKYQSPRKRQBMHBMWDLFQ	f
29	andreea1	Gogulescu	Gogu	profprofprof007@gmail.com	f3a18e63ab15dd88ad848a96650df578a8084b8c0dba165dcb6549d13a6875ca	2022-01-20 17:16:30.877121	red	comun	\N	/poze_uploadate/andreea1/poza.jpg	202204171630/andreea1/DLTLTSTMYPXKDXCYYFFBVCTXBGPKSMRNFRRFDWQJBDXQJGRWGDZWRRXDVJCXBMBHPXPMGQNYNJLNJFBTTMDCVNWPNYNGBDRVHXKX	t
35	admin1	Gogulescu	Gogu	profprofprof007@gmail.com	e9b1b52bc10f02579484d5c6faceca28eafecc161dcf6033a24ee69b8f95786e	2022-01-21 18:24:49.977557	red	comun	\N		202205182449/admin1/KPHMTYXCPZHKTFFPZLHLJJNBGVVCSBHTMDNTGXTNXRYPLMTGTYXCMJKNXDGPCCXVBNXGLWMFMKYYTKDXWRZHPFBZGFKCMSQBVGJT	f
30	prof98907	Nistor	Gogu	profprofprof007@gmail.com	081daadbe90e6b41afd5b4132d2772d4f813b83d39020a7dcd023050db0450bb	2022-01-20 17:26:53.96366	red	comun	\N		202204172653/prof98907/GHTZCHSQTYZSBWWKXHVRPKRYTQJHBFCKJGFSMZNRHHQBCYXBMZHLCRFRSFQWRNWNPKPBFKFSCKDDRXMXRTFPDMZPDCJVYPJTJMLB	t
32	deea	Gogulescu	Gogu	profprofprof007@gmail.com	081daadbe90e6b41afd5b4132d2772d4f813b83d39020a7dcd023050db0450bb	2022-01-20 17:40:15.055744	red	comun	\N		202204174015/deea/ZCFPGCFJBGDVZCGYYMDJGQWZRDPLTWTRPPHFPYZNQZFWMRYBGVDRKNXWRXBSLMCBVNRJQKJDJCYZPQSKGHBHLCYMCNBTNLYFTLNN	t
6	profadmin	Nistor	Andreea	profprofprof007@gmail.com	081daadbe90e6b41afd5b4132d2772d4f813b83d39020a7dcd023050db0450bb	2022-01-19 23:52:00.256829	red	admin	\N	C:\\Users\\Admin\\AppData\\Local\\Temp\\fb1f922334d44343d38258c00	20220323520/prof56626/SNTMJPHHHZYCGFXWZSXGHLDHJQHCNCNQPYZFMDVPXDJHQRDGTFSKGBDWBXTMQSZNTQKCJLJYQTZTPVCYTKBXFYGRXZDGMQCQVNGN	t
36	admina	Gogulescu	Gogu	andreeanistor9600@gmail.com	e9b1b52bc10f02579484d5c6faceca28eafecc161dcf6033a24ee69b8f95786e	2022-01-21 18:26:19.258549	red	comun	\N		202205182619/admina/CGBQGXYWGBVDCGZGKKLJDRXSSNXMNGFVXDXZCFLBQMWQQMDKNCGWXTQPCGMSMXXSWLWQDGYYGYWSYQCCZWXSYPGQVRDDVDJRZHDS	f
37	admin10	Gogulescu	Gogu	profprofprof007@gmail.com	081daadbe90e6b41afd5b4132d2772d4f813b83d39020a7dcd023050db0450bb	2022-01-23 13:39:13.772615	red	comun	\N		202200133913/admin10/PMSMMTCQHTPCSQPVNDTRBTWPDYMZWBKZSNWXZCPJMDQQYLBDLLNPJMKPGSMRTGWHHVNXSLWHSFBNLJMFPQTZJFYLVJLQDHYRQGKW	t
38	cineva123	Gogulescu	Gogu	profprofprof007@gmail.com	e9b1b52bc10f02579484d5c6faceca28eafecc161dcf6033a24ee69b8f95786e	2022-01-23 13:49:59.759155	red	admin	f		202200134959/cineva123/TKHXYKQGQHFQSBBZBGRMGQBMDSGMPHBLBBJWGHFPVFFDTBPCJZVPSYBFSXXRSKNQNKJZSXTRMRTGVCBLVFJCLSPVGSMCVKJSQXGH	t
21	prof24007	Gogulescu	Gogu	profprofprof007@gmail.com	e9b1b52bc10f02579484d5c6faceca28eafecc161dcf6033a24ee69b8f95786e	2022-01-20 13:59:39.314733	red	comun	t		202204135939/prof24007/SLHYDGFVSMPQGHSFRFZKHVWNYBLHRSXFLFWYWSNJQMKYNTLZPQRRMQSYYHQSWHVHLDTWDPFJXSPYNWYPRLFGZXQHNJWJZTRLNZFP	t
\.


--
-- TOC entry 3360 (class 0 OID 0)
-- Dependencies: 210
-- Name: accesari_id_seq; Type: SEQUENCE SET; Schema: public; Owner: andreean
--

SELECT pg_catalog.setval('public.accesari_id_seq', 1922, true);


--
-- TOC entry 3361 (class 0 OID 0)
-- Dependencies: 212
-- Name: produse_id_seq; Type: SEQUENCE SET; Schema: public; Owner: andreean
--

SELECT pg_catalog.setval('public.produse_id_seq', 22, true);


--
-- TOC entry 3362 (class 0 OID 0)
-- Dependencies: 214
-- Name: utilizatori_id_seq; Type: SEQUENCE SET; Schema: public; Owner: andreean
--

SELECT pg_catalog.setval('public.utilizatori_id_seq', 38, true);


--
-- TOC entry 3197 (class 2606 OID 16451)
-- Name: accesari accesari_pkey; Type: CONSTRAINT; Schema: public; Owner: andreean
--

ALTER TABLE ONLY public.accesari
    ADD CONSTRAINT accesari_pkey PRIMARY KEY (id);


--
-- TOC entry 3199 (class 2606 OID 16453)
-- Name: produse produse_nume_key; Type: CONSTRAINT; Schema: public; Owner: andreean
--

ALTER TABLE ONLY public.produse
    ADD CONSTRAINT produse_nume_key UNIQUE (nume);


--
-- TOC entry 3201 (class 2606 OID 16455)
-- Name: produse produse_pkey; Type: CONSTRAINT; Schema: public; Owner: andreean
--

ALTER TABLE ONLY public.produse
    ADD CONSTRAINT produse_pkey PRIMARY KEY (id);


--
-- TOC entry 3203 (class 2606 OID 16457)
-- Name: utilizatori utilizatori_pkey; Type: CONSTRAINT; Schema: public; Owner: andreean
--

ALTER TABLE ONLY public.utilizatori
    ADD CONSTRAINT utilizatori_pkey PRIMARY KEY (id);


--
-- TOC entry 3205 (class 2606 OID 16459)
-- Name: utilizatori utilizatori_username_key; Type: CONSTRAINT; Schema: public; Owner: andreean
--

ALTER TABLE ONLY public.utilizatori
    ADD CONSTRAINT utilizatori_username_key UNIQUE (username);


--
-- TOC entry 3206 (class 2606 OID 16460)
-- Name: accesari accesari_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: andreean
--

ALTER TABLE ONLY public.accesari
    ADD CONSTRAINT accesari_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.utilizatori(id);


-- Completed on 2022-04-29 12:54:42

--
-- PostgreSQL database dump complete
--

