PGDMP  *                    |         
   MediaVault    16.1    16.0 �    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16390 
   MediaVault    DATABASE     �   CREATE DATABASE "MediaVault" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = icu LOCALE = 'en_US.UTF-8' ICU_LOCALE = 'en-US';
    DROP DATABASE "MediaVault";
                admin    false            �            1255    16892 *   check_write_access_before_recommendation()    FUNCTION        CREATE FUNCTION public.check_write_access_before_recommendation() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    user_has_write_access BOOLEAN;
BEGIN
    -- Перевірте, чи користувач має доступ на запис для вказаного файлу
    SELECT write
    INTO user_has_write_access
    FROM AccessDeniedList
    WHERE user_id = NEW.user_id AND file_id = NEW.recommended_file_id;

    -- Якщо користувач не має доступу на запис, відмініть вставку рекомендації
    IF NOT user_has_write_access THEN
        RAISE EXCEPTION 'Користувач не має доступу на запис до цього файлу';
    END IF;

    RETURN NEW;
END;
$$;
 A   DROP FUNCTION public.check_write_access_before_recommendation();
       public          admin    false            �            1255    16887 I   getuseraccessdeniedlist(timestamp without time zone, character varying[])    FUNCTION     �  CREATE FUNCTION public.getuseraccessdeniedlist(registration_date_threshold timestamp without time zone, forbidden_categories character varying[]) RETURNS TABLE(user_id integer, first_name character varying, second_name character varying, email character varying, username character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        u.user_id,
        u.first_name,
        u.second_name,
        u.email,
        u.username
    FROM
        "User" u
    WHERE
        u.registration_date >= registration_date_threshold
        AND EXISTS (
            SELECT 1
            FROM
                AccessDeniedList adl
            JOIN FileCategoryGenre fcg ON adl.file_id = fcg.file_id
            JOIN CategoryAndGenre cg ON fcg.category_genre_id = cg.category_genre_id
            WHERE
                adl.user_id = u.user_id
                AND cg.category_genre_name = ANY(forbidden_categories)
        );
END;
$$;
 �   DROP FUNCTION public.getuseraccessdeniedlist(registration_date_threshold timestamp without time zone, forbidden_categories character varying[]);
       public          admin    false            �            1255    16941 O   showrecentuserswithaccessdenied(timestamp without time zone, character varying) 	   PROCEDURE     �  CREATE PROCEDURE public.showrecentuserswithaccessdenied(IN recent_registration_date timestamp without time zone, IN denied_category_genre_name character varying)
    LANGUAGE plpgsql
    AS $$
DECLARE
    user_record RECORD;
BEGIN
    FOR user_record IN
        SELECT "User".*
        FROM "User"
        INNER JOIN AccessDeniedList ON "User".user_id = AccessDeniedList.user_id
        INNER JOIN MultimediaFile ON AccessDeniedList.file_id = MultimediaFile.file_id
        INNER JOIN FileCategoryGenre ON MultimediaFile.file_id = FileCategoryGenre.file_id
        INNER JOIN CategoryAndGenre ON FileCategoryGenre.category_genre_id = CategoryAndGenre.category_genre_id
        WHERE "User".registration_date >= recent_registration_date
        AND CategoryAndGenre.category_genre_name = denied_category_genre_name
    LOOP
        -- Вивести або обробити дані користувача за вашим бажанням
        -- У цьому прикладі просто виводимо дані
        RAISE NOTICE 'User ID: %, First Name: %, Second Name: %, Email: %',
            user_record.user_id, user_record.first_name, user_record.second_name, user_record.email;
    END LOOP;
END;
$$;
 �   DROP PROCEDURE public.showrecentuserswithaccessdenied(IN recent_registration_date timestamp without time zone, IN denied_category_genre_name character varying);
       public          admin    false            �            1255    16939    update_avg_rating()    FUNCTION     �  CREATE FUNCTION public.update_avg_rating() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    total_ratings INTEGER;
    avg_rating FLOAT;
BEGIN
    -- Обчислення загальної кількості рекомендацій для файлу
    SELECT COUNT(*) INTO total_ratings
    FROM Recommendation
    WHERE Recommendation.recommended_file_id = NEW.recommended_file_id;

    -- Обчислення середньої популярності для файлу
    IF total_ratings > 0 THEN
        SELECT COALESCE(AVG(popularity), 0) INTO avg_rating
        FROM Recommendation
        WHERE Recommendation.recommended_file_id = NEW.recommended_file_id;
    ELSE
        avg_rating := 0;
    END IF;

    -- Оновлення avg_rating в залежності від умов
    UPDATE MultimediaFile
    SET avg_rating = CASE
        WHEN total_ratings > 3 AND total_ratings % 5 = 0 THEN MultimediaFile.avg_rating + 0.1
        WHEN total_ratings <= 3 AND total_ratings % 3 = 0 THEN MultimediaFile.avg_rating - 0.2
        ELSE MultimediaFile.avg_rating
    END
    WHERE MultimediaFile.file_id = NEW.recommended_file_id;

    RETURN NEW;
END;
$$;
 *   DROP FUNCTION public.update_avg_rating();
       public          admin    false            �            1259    16661    User    TABLE     �  CREATE TABLE public."User" (
    user_id integer NOT NULL,
    first_name character varying(256) NOT NULL,
    second_name character varying(256) NOT NULL,
    email character varying(256) NOT NULL,
    username character varying(256) NOT NULL,
    registration_date timestamp without time zone NOT NULL,
    status boolean NOT NULL,
    role_id integer NOT NULL,
    password_hash character varying(256),
    CONSTRAINT check_email_format CHECK (((email)::text ~* '^[^@]+@[^@]+\.[a-zA-Z]{2,}$'::text)),
    CONSTRAINT check_email_format_simple CHECK (((POSITION(('@'::text) IN (email)) > 0) AND (POSITION(('.'::text) IN (SUBSTRING(email FROM POSITION(('@'::text) IN (email))))) > 0)))
);
    DROP TABLE public."User";
       public         heap    admin    false            �            1259    16660    User_user_id_seq    SEQUENCE     �   CREATE SEQUENCE public."User_user_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public."User_user_id_seq";
       public          admin    false    234            �           0    0    User_user_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public."User_user_id_seq" OWNED BY public."User".user_id;
          public          admin    false    233            �            1259    16678    View    TABLE     �   CREATE TABLE public."View" (
    view_id integer NOT NULL,
    file_id integer NOT NULL,
    user_id integer NOT NULL,
    view_date timestamp without time zone NOT NULL
);
    DROP TABLE public."View";
       public         heap    admin    false            �            1259    16677    View_view_id_seq    SEQUENCE     �   CREATE SEQUENCE public."View_view_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public."View_view_id_seq";
       public          admin    false    238            �           0    0    View_view_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public."View_view_id_seq" OWNED BY public."View".view_id;
          public          admin    false    237            �            1259    16580    accessdeniedlist    TABLE     �  CREATE TABLE public.accessdeniedlist (
    adl_id integer NOT NULL,
    file_id integer NOT NULL,
    user_id integer NOT NULL,
    read boolean NOT NULL,
    write boolean NOT NULL,
    delete boolean NOT NULL,
    CONSTRAINT accessdeniedlist_delete_check CHECK ((delete = ANY (ARRAY[true, false]))),
    CONSTRAINT accessdeniedlist_read_check CHECK ((read = ANY (ARRAY[true, false]))),
    CONSTRAINT accessdeniedlist_write_check CHECK ((write = ANY (ARRAY[true, false])))
);
 $   DROP TABLE public.accessdeniedlist;
       public         heap    admin    false            �            1259    16579    accessdeniedlist_adl_id_seq    SEQUENCE     �   CREATE SEQUENCE public.accessdeniedlist_adl_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public.accessdeniedlist_adl_id_seq;
       public          admin    false    216            �           0    0    accessdeniedlist_adl_id_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE public.accessdeniedlist_adl_id_seq OWNED BY public.accessdeniedlist.adl_id;
          public          admin    false    215            �            1259    16590    categoryandgenre    TABLE     �   CREATE TABLE public.categoryandgenre (
    category_genre_id integer NOT NULL,
    category_genre_name character varying(50) NOT NULL,
    description character varying(4096) NOT NULL
);
 $   DROP TABLE public.categoryandgenre;
       public         heap    admin    false            �            1259    16589 &   categoryandgenre_category_genre_id_seq    SEQUENCE     �   CREATE SEQUENCE public.categoryandgenre_category_genre_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 =   DROP SEQUENCE public.categoryandgenre_category_genre_id_seq;
       public          admin    false    218            �           0    0 &   categoryandgenre_category_genre_id_seq    SEQUENCE OWNED BY     q   ALTER SEQUENCE public.categoryandgenre_category_genre_id_seq OWNED BY public.categoryandgenre.category_genre_id;
          public          admin    false    217            �            1259    16601    comment    TABLE     �   CREATE TABLE public.comment (
    comment_id integer NOT NULL,
    file_id integer NOT NULL,
    user_id integer NOT NULL,
    comment_text character varying(4096) NOT NULL,
    rating integer NOT NULL
);
    DROP TABLE public.comment;
       public         heap    admin    false            �            1259    16600    comment_comment_id_seq    SEQUENCE     �   CREATE SEQUENCE public.comment_comment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.comment_comment_id_seq;
       public          admin    false    220            �           0    0    comment_comment_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.comment_comment_id_seq OWNED BY public.comment.comment_id;
          public          admin    false    219            �            1259    16610    filecategorygenre    TABLE     p   CREATE TABLE public.filecategorygenre (
    category_genre_id integer NOT NULL,
    file_id integer NOT NULL
);
 %   DROP TABLE public.filecategorygenre;
       public         heap    admin    false            �            1259    16609 '   filecategorygenre_category_genre_id_seq    SEQUENCE     �   CREATE SEQUENCE public.filecategorygenre_category_genre_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 >   DROP SEQUENCE public.filecategorygenre_category_genre_id_seq;
       public          admin    false    222            �           0    0 '   filecategorygenre_category_genre_id_seq    SEQUENCE OWNED BY     s   ALTER SEQUENCE public.filecategorygenre_category_genre_id_seq OWNED BY public.filecategorygenre.category_genre_id;
          public          admin    false    221            �            1259    16617    filetype    TABLE     r   CREATE TABLE public.filetype (
    file_type_id integer NOT NULL,
    type_name character varying(50) NOT NULL
);
    DROP TABLE public.filetype;
       public         heap    admin    false            �            1259    16616    filetype_file_type_id_seq    SEQUENCE     �   CREATE SEQUENCE public.filetype_file_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.filetype_file_type_id_seq;
       public          admin    false    224            �           0    0    filetype_file_type_id_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.filetype_file_type_id_seq OWNED BY public.filetype.file_type_id;
          public          admin    false    223            �            1259    16624    multimediafile    TABLE     �  CREATE TABLE public.multimediafile (
    file_id integer NOT NULL,
    file_name character varying(50) NOT NULL,
    file_path character varying(100) NOT NULL,
    upload_date timestamp without time zone NOT NULL,
    uploader_id integer NOT NULL,
    file_type_id integer NOT NULL,
    avg_rating double precision DEFAULT 0,
    metadata jsonb,
    visible boolean DEFAULT true NOT NULL
);
 "   DROP TABLE public.multimediafile;
       public         heap    admin    false            �            1259    16623    multimediafile_file_id_seq    SEQUENCE     �   CREATE SEQUENCE public.multimediafile_file_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public.multimediafile_file_id_seq;
       public          admin    false    226            �           0    0    multimediafile_file_id_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public.multimediafile_file_id_seq OWNED BY public.multimediafile.file_id;
          public          admin    false    225            �            1259    16640    recommendation    TABLE     �   CREATE TABLE public.recommendation (
    recommendation_id integer NOT NULL,
    popularity integer NOT NULL,
    user_id integer NOT NULL,
    recommended_file_id integer NOT NULL,
    creation_date timestamp without time zone NOT NULL
);
 "   DROP TABLE public.recommendation;
       public         heap    admin    false            �            1259    16639 $   recommendation_recommendation_id_seq    SEQUENCE     �   CREATE SEQUENCE public.recommendation_recommendation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ;   DROP SEQUENCE public.recommendation_recommendation_id_seq;
       public          admin    false    228            �           0    0 $   recommendation_recommendation_id_seq    SEQUENCE OWNED BY     m   ALTER SEQUENCE public.recommendation_recommendation_id_seq OWNED BY public.recommendation.recommendation_id;
          public          admin    false    227            �            1259    16647    tag    TABLE     f   CREATE TABLE public.tag (
    tag_id integer NOT NULL,
    tag_name character varying(50) NOT NULL
);
    DROP TABLE public.tag;
       public         heap    admin    false            �            1259    16646    tag_tag_id_seq    SEQUENCE     �   CREATE SEQUENCE public.tag_tag_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.tag_tag_id_seq;
       public          admin    false    230            �           0    0    tag_tag_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.tag_tag_id_seq OWNED BY public.tag.tag_id;
          public          admin    false    229            �            1259    16654    tagtomediafile    TABLE     b   CREATE TABLE public.tagtomediafile (
    tag_id integer NOT NULL,
    file_id integer NOT NULL
);
 "   DROP TABLE public.tagtomediafile;
       public         heap    admin    false            �            1259    16653    tagtomediafile_tag_id_seq    SEQUENCE     �   CREATE SEQUENCE public.tagtomediafile_tag_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.tagtomediafile_tag_id_seq;
       public          admin    false    232            �           0    0    tagtomediafile_tag_id_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.tagtomediafile_tag_id_seq OWNED BY public.tagtomediafile.tag_id;
          public          admin    false    231            �            1259    16671    userrole    TABLE     m   CREATE TABLE public.userrole (
    role_id integer NOT NULL,
    role_name character varying(50) NOT NULL
);
    DROP TABLE public.userrole;
       public         heap    admin    false            �            1259    16670    userrole_role_id_seq    SEQUENCE     �   CREATE SEQUENCE public.userrole_role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.userrole_role_id_seq;
       public          admin    false    236            �           0    0    userrole_role_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.userrole_role_id_seq OWNED BY public.userrole.role_id;
          public          admin    false    235            �            1259    16915 	   userstats    VIEW     T  CREATE VIEW public.userstats AS
 SELECT u.user_id,
    u.first_name,
    u.second_name,
    u.email,
    u.username,
    count(DISTINCT v.file_id) AS total_views,
    COALESCE(max(r.popularity), 0) AS max_popularity,
    string_agg(concat(mf.file_type_id, ':', mf.file_name), ', '::text) AS top_files,
    COALESCE(count(DISTINCT r.recommendation_id), (0)::bigint) AS recommendation_count,
    string_agg(concat(r.user_id, ':', r.popularity), ', '::text) AS low_rating_recommendations
   FROM (((public."User" u
     LEFT JOIN public."View" v ON ((u.user_id = v.user_id)))
     LEFT JOIN public.recommendation r ON ((u.user_id = r.user_id)))
     LEFT JOIN public.multimediafile mf ON ((r.recommended_file_id = mf.file_id)))
  WHERE ((r.popularity < 2) OR (r.popularity IS NULL))
  GROUP BY u.user_id, u.first_name, u.second_name, u.email, u.username;
    DROP VIEW public.userstats;
       public          admin    false    238    226    226    226    228    228    228    228    234    234    234    234    234    238            �            1259    16879    usersummary    VIEW     _  CREATE VIEW public.usersummary AS
 SELECT u.user_id,
    u.first_name,
    u.second_name,
    u.email,
    u.username,
    u.registration_date,
    u.status,
    r.role_name AS role,
    COALESCE(popular_files.popular_files_info, 'No popular files'::text) AS popular_files,
    COALESCE(recommendation_count.recommendation_count, (0)::bigint) AS recommendation_count,
    COALESCE(low_rating_recommendations.low_rating_recommendations_info, 'No low rating recommendations'::text) AS low_rating_recommendations
   FROM ((((public."User" u
     JOIN public.userrole r ON ((u.role_id = r.role_id)))
     LEFT JOIN ( SELECT ranked_files.user_id,
            string_agg(ranked_files.file_info, ', '::text) AS popular_files_info
           FROM ( SELECT r_1.user_id,
                    concat(mf.file_name, ' (', ft.type_name, ')') AS file_info,
                    rank() OVER (PARTITION BY r_1.user_id ORDER BY r_1.popularity DESC) AS file_rank
                   FROM ((public.recommendation r_1
                     JOIN public.multimediafile mf ON ((r_1.recommended_file_id = mf.file_id)))
                     JOIN public.filetype ft ON ((mf.file_type_id = ft.file_type_id)))) ranked_files
          WHERE (ranked_files.file_rank <= 5)
          GROUP BY ranked_files.user_id) popular_files ON ((u.user_id = popular_files.user_id)))
     LEFT JOIN ( SELECT recommendation.user_id,
            count(recommendation.recommendation_id) AS recommendation_count
           FROM public.recommendation
          GROUP BY recommendation.user_id) recommendation_count ON ((u.user_id = recommendation_count.user_id)))
     LEFT JOIN ( SELECT r_1.user_id,
            string_agg(concat(mf.file_name, ' (', ft.type_name, ')'), ', '::text) AS low_rating_recommendations_info
           FROM ((public.recommendation r_1
             JOIN public.multimediafile mf ON ((r_1.recommended_file_id = mf.file_id)))
             JOIN public.filetype ft ON ((mf.file_type_id = ft.file_type_id)))
          WHERE (r_1.popularity < 2)
          GROUP BY r_1.user_id
         LIMIT 2) low_rating_recommendations ON ((u.user_id = low_rating_recommendations.user_id)));
    DROP VIEW public.usersummary;
       public          admin    false    234    234    226    234    234    234    234    226    226    224    234    234    228    228    224    228    228    236    236            �           2604    16664    User user_id    DEFAULT     p   ALTER TABLE ONLY public."User" ALTER COLUMN user_id SET DEFAULT nextval('public."User_user_id_seq"'::regclass);
 =   ALTER TABLE public."User" ALTER COLUMN user_id DROP DEFAULT;
       public          admin    false    233    234    234            �           2604    16681    View view_id    DEFAULT     p   ALTER TABLE ONLY public."View" ALTER COLUMN view_id SET DEFAULT nextval('public."View_view_id_seq"'::regclass);
 =   ALTER TABLE public."View" ALTER COLUMN view_id DROP DEFAULT;
       public          admin    false    238    237    238            �           2604    16583    accessdeniedlist adl_id    DEFAULT     �   ALTER TABLE ONLY public.accessdeniedlist ALTER COLUMN adl_id SET DEFAULT nextval('public.accessdeniedlist_adl_id_seq'::regclass);
 F   ALTER TABLE public.accessdeniedlist ALTER COLUMN adl_id DROP DEFAULT;
       public          admin    false    216    215    216            �           2604    16593 "   categoryandgenre category_genre_id    DEFAULT     �   ALTER TABLE ONLY public.categoryandgenre ALTER COLUMN category_genre_id SET DEFAULT nextval('public.categoryandgenre_category_genre_id_seq'::regclass);
 Q   ALTER TABLE public.categoryandgenre ALTER COLUMN category_genre_id DROP DEFAULT;
       public          admin    false    217    218    218            �           2604    16604    comment comment_id    DEFAULT     x   ALTER TABLE ONLY public.comment ALTER COLUMN comment_id SET DEFAULT nextval('public.comment_comment_id_seq'::regclass);
 A   ALTER TABLE public.comment ALTER COLUMN comment_id DROP DEFAULT;
       public          admin    false    219    220    220            �           2604    16613 #   filecategorygenre category_genre_id    DEFAULT     �   ALTER TABLE ONLY public.filecategorygenre ALTER COLUMN category_genre_id SET DEFAULT nextval('public.filecategorygenre_category_genre_id_seq'::regclass);
 R   ALTER TABLE public.filecategorygenre ALTER COLUMN category_genre_id DROP DEFAULT;
       public          admin    false    222    221    222            �           2604    16620    filetype file_type_id    DEFAULT     ~   ALTER TABLE ONLY public.filetype ALTER COLUMN file_type_id SET DEFAULT nextval('public.filetype_file_type_id_seq'::regclass);
 D   ALTER TABLE public.filetype ALTER COLUMN file_type_id DROP DEFAULT;
       public          admin    false    224    223    224            �           2604    16627    multimediafile file_id    DEFAULT     �   ALTER TABLE ONLY public.multimediafile ALTER COLUMN file_id SET DEFAULT nextval('public.multimediafile_file_id_seq'::regclass);
 E   ALTER TABLE public.multimediafile ALTER COLUMN file_id DROP DEFAULT;
       public          admin    false    226    225    226            �           2604    16643     recommendation recommendation_id    DEFAULT     �   ALTER TABLE ONLY public.recommendation ALTER COLUMN recommendation_id SET DEFAULT nextval('public.recommendation_recommendation_id_seq'::regclass);
 O   ALTER TABLE public.recommendation ALTER COLUMN recommendation_id DROP DEFAULT;
       public          admin    false    227    228    228            �           2604    16650 
   tag tag_id    DEFAULT     h   ALTER TABLE ONLY public.tag ALTER COLUMN tag_id SET DEFAULT nextval('public.tag_tag_id_seq'::regclass);
 9   ALTER TABLE public.tag ALTER COLUMN tag_id DROP DEFAULT;
       public          admin    false    230    229    230            �           2604    16657    tagtomediafile tag_id    DEFAULT     ~   ALTER TABLE ONLY public.tagtomediafile ALTER COLUMN tag_id SET DEFAULT nextval('public.tagtomediafile_tag_id_seq'::regclass);
 D   ALTER TABLE public.tagtomediafile ALTER COLUMN tag_id DROP DEFAULT;
       public          admin    false    232    231    232            �           2604    16674    userrole role_id    DEFAULT     t   ALTER TABLE ONLY public.userrole ALTER COLUMN role_id SET DEFAULT nextval('public.userrole_role_id_seq'::regclass);
 ?   ALTER TABLE public.userrole ALTER COLUMN role_id DROP DEFAULT;
       public          admin    false    236    235    236            �          0    16661    User 
   TABLE DATA           �   COPY public."User" (user_id, first_name, second_name, email, username, registration_date, status, role_id, password_hash) FROM stdin;
    public          admin    false    234   {�       �          0    16678    View 
   TABLE DATA           F   COPY public."View" (view_id, file_id, user_id, view_date) FROM stdin;
    public          admin    false    238   �       �          0    16580    accessdeniedlist 
   TABLE DATA           Y   COPY public.accessdeniedlist (adl_id, file_id, user_id, read, write, delete) FROM stdin;
    public          admin    false    216   ��       �          0    16590    categoryandgenre 
   TABLE DATA           _   COPY public.categoryandgenre (category_genre_id, category_genre_name, description) FROM stdin;
    public          admin    false    218   �       �          0    16601    comment 
   TABLE DATA           U   COPY public.comment (comment_id, file_id, user_id, comment_text, rating) FROM stdin;
    public          admin    false    220   ��       �          0    16610    filecategorygenre 
   TABLE DATA           G   COPY public.filecategorygenre (category_genre_id, file_id) FROM stdin;
    public          admin    false    222   �       �          0    16617    filetype 
   TABLE DATA           ;   COPY public.filetype (file_type_id, type_name) FROM stdin;
    public          admin    false    224   ��       �          0    16624    multimediafile 
   TABLE DATA           �   COPY public.multimediafile (file_id, file_name, file_path, upload_date, uploader_id, file_type_id, avg_rating, metadata, visible) FROM stdin;
    public          admin    false    226   ��       �          0    16640    recommendation 
   TABLE DATA           t   COPY public.recommendation (recommendation_id, popularity, user_id, recommended_file_id, creation_date) FROM stdin;
    public          admin    false    228   ��       �          0    16647    tag 
   TABLE DATA           /   COPY public.tag (tag_id, tag_name) FROM stdin;
    public          admin    false    230   �       �          0    16654    tagtomediafile 
   TABLE DATA           9   COPY public.tagtomediafile (tag_id, file_id) FROM stdin;
    public          admin    false    232   ��       �          0    16671    userrole 
   TABLE DATA           6   COPY public.userrole (role_id, role_name) FROM stdin;
    public          admin    false    236   =�       �           0    0    User_user_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public."User_user_id_seq"', 3, true);
          public          admin    false    233            �           0    0    View_view_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public."View_view_id_seq"', 20, true);
          public          admin    false    237            �           0    0    accessdeniedlist_adl_id_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public.accessdeniedlist_adl_id_seq', 25, true);
          public          admin    false    215            �           0    0 &   categoryandgenre_category_genre_id_seq    SEQUENCE SET     T   SELECT pg_catalog.setval('public.categoryandgenre_category_genre_id_seq', 4, true);
          public          admin    false    217            �           0    0    comment_comment_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.comment_comment_id_seq', 27, true);
          public          admin    false    219            �           0    0 '   filecategorygenre_category_genre_id_seq    SEQUENCE SET     V   SELECT pg_catalog.setval('public.filecategorygenre_category_genre_id_seq', 1, false);
          public          admin    false    221            �           0    0    filetype_file_type_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.filetype_file_type_id_seq', 4, true);
          public          admin    false    223            �           0    0    multimediafile_file_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.multimediafile_file_id_seq', 1, true);
          public          admin    false    225            �           0    0 $   recommendation_recommendation_id_seq    SEQUENCE SET     R   SELECT pg_catalog.setval('public.recommendation_recommendation_id_seq', 7, true);
          public          admin    false    227            �           0    0    tag_tag_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.tag_tag_id_seq', 1, false);
          public          admin    false    229            �           0    0    tagtomediafile_tag_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.tagtomediafile_tag_id_seq', 1, false);
          public          admin    false    231            �           0    0    userrole_role_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.userrole_role_id_seq', 1, false);
          public          admin    false    235            �           2606    16669    User User_pkey 
   CONSTRAINT     U   ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (user_id);
 <   ALTER TABLE ONLY public."User" DROP CONSTRAINT "User_pkey";
       public            admin    false    234            �           2606    16683    View View_pkey 
   CONSTRAINT     U   ALTER TABLE ONLY public."View"
    ADD CONSTRAINT "View_pkey" PRIMARY KEY (view_id);
 <   ALTER TABLE ONLY public."View" DROP CONSTRAINT "View_pkey";
       public            admin    false    238            �           2606    16588 &   accessdeniedlist accessdeniedlist_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.accessdeniedlist
    ADD CONSTRAINT accessdeniedlist_pkey PRIMARY KEY (adl_id);
 P   ALTER TABLE ONLY public.accessdeniedlist DROP CONSTRAINT accessdeniedlist_pkey;
       public            admin    false    216            �           2606    16599 9   categoryandgenre categoryandgenre_category_genre_name_key 
   CONSTRAINT     �   ALTER TABLE ONLY public.categoryandgenre
    ADD CONSTRAINT categoryandgenre_category_genre_name_key UNIQUE (category_genre_name);
 c   ALTER TABLE ONLY public.categoryandgenre DROP CONSTRAINT categoryandgenre_category_genre_name_key;
       public            admin    false    218            �           2606    16597 &   categoryandgenre categoryandgenre_pkey 
   CONSTRAINT     s   ALTER TABLE ONLY public.categoryandgenre
    ADD CONSTRAINT categoryandgenre_pkey PRIMARY KEY (category_genre_id);
 P   ALTER TABLE ONLY public.categoryandgenre DROP CONSTRAINT categoryandgenre_pkey;
       public            admin    false    218            �           2606    16608    comment comment_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.comment
    ADD CONSTRAINT comment_pkey PRIMARY KEY (comment_id);
 >   ALTER TABLE ONLY public.comment DROP CONSTRAINT comment_pkey;
       public            admin    false    220            �           2606    16622    filetype filetype_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.filetype
    ADD CONSTRAINT filetype_pkey PRIMARY KEY (file_type_id);
 @   ALTER TABLE ONLY public.filetype DROP CONSTRAINT filetype_pkey;
       public            admin    false    224            �           2606    16629 "   multimediafile multimediafile_pkey 
   CONSTRAINT     e   ALTER TABLE ONLY public.multimediafile
    ADD CONSTRAINT multimediafile_pkey PRIMARY KEY (file_id);
 L   ALTER TABLE ONLY public.multimediafile DROP CONSTRAINT multimediafile_pkey;
       public            admin    false    226            �           2606    16645 "   recommendation recommendation_pkey 
   CONSTRAINT     o   ALTER TABLE ONLY public.recommendation
    ADD CONSTRAINT recommendation_pkey PRIMARY KEY (recommendation_id);
 L   ALTER TABLE ONLY public.recommendation DROP CONSTRAINT recommendation_pkey;
       public            admin    false    228            �           2606    16652    tag tag_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.tag
    ADD CONSTRAINT tag_pkey PRIMARY KEY (tag_id);
 6   ALTER TABLE ONLY public.tag DROP CONSTRAINT tag_pkey;
       public            admin    false    230            �           2606    16792 "   filetype unique_filetype_type_name 
   CONSTRAINT     b   ALTER TABLE ONLY public.filetype
    ADD CONSTRAINT unique_filetype_type_name UNIQUE (type_name);
 L   ALTER TABLE ONLY public.filetype DROP CONSTRAINT unique_filetype_type_name;
       public            admin    false    224            �           2606    16798 .   multimediafile unique_multimediafile_file_name 
   CONSTRAINT     n   ALTER TABLE ONLY public.multimediafile
    ADD CONSTRAINT unique_multimediafile_file_name UNIQUE (file_name);
 X   ALTER TABLE ONLY public.multimediafile DROP CONSTRAINT unique_multimediafile_file_name;
       public            admin    false    226            �           2606    16794    tag unique_tag_tag_name 
   CONSTRAINT     V   ALTER TABLE ONLY public.tag
    ADD CONSTRAINT unique_tag_tag_name UNIQUE (tag_name);
 A   ALTER TABLE ONLY public.tag DROP CONSTRAINT unique_tag_tag_name;
       public            admin    false    230            �           2606    16796 "   userrole unique_userrole_role_name 
   CONSTRAINT     b   ALTER TABLE ONLY public.userrole
    ADD CONSTRAINT unique_userrole_role_name UNIQUE (role_name);
 L   ALTER TABLE ONLY public.userrole DROP CONSTRAINT unique_userrole_role_name;
       public            admin    false    236            �           2606    16676    userrole userrole_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.userrole
    ADD CONSTRAINT userrole_pkey PRIMARY KEY (role_id);
 @   ALTER TABLE ONLY public.userrole DROP CONSTRAINT userrole_pkey;
       public            admin    false    236                       2620    16893 )   recommendation check_write_access_trigger    TRIGGER     �   CREATE TRIGGER check_write_access_trigger BEFORE INSERT ON public.recommendation FOR EACH ROW EXECUTE FUNCTION public.check_write_access_before_recommendation();
 B   DROP TRIGGER check_write_access_trigger ON public.recommendation;
       public          admin    false    228    253                       2620    16940 (   recommendation update_avg_rating_trigger    TRIGGER     �   CREATE TRIGGER update_avg_rating_trigger BEFORE INSERT OR UPDATE ON public.recommendation FOR EACH ROW EXECUTE FUNCTION public.update_avg_rating();
 A   DROP TRIGGER update_avg_rating_trigger ON public.recommendation;
       public          admin    false    228    254                       2606    16684 4   filecategorygenre categoryandgenre_filecategorygenre    FK CONSTRAINT     �   ALTER TABLE ONLY public.filecategorygenre
    ADD CONSTRAINT categoryandgenre_filecategorygenre FOREIGN KEY (category_genre_id) REFERENCES public.categoryandgenre(category_genre_id);
 ^   ALTER TABLE ONLY public.filecategorygenre DROP CONSTRAINT categoryandgenre_filecategorygenre;
       public          admin    false    3556    218    222                       2606    16689    comment comment_multimediafile    FK CONSTRAINT     �   ALTER TABLE ONLY public.comment
    ADD CONSTRAINT comment_multimediafile FOREIGN KEY (file_id) REFERENCES public.multimediafile(file_id);
 H   ALTER TABLE ONLY public.comment DROP CONSTRAINT comment_multimediafile;
       public          admin    false    220    3564    226            �           2606    16799 3   accessdeniedlist fk_accessdeniedlist_multimediafile    FK CONSTRAINT     �   ALTER TABLE ONLY public.accessdeniedlist
    ADD CONSTRAINT fk_accessdeniedlist_multimediafile FOREIGN KEY (file_id) REFERENCES public.multimediafile(file_id) ON UPDATE CASCADE ON DELETE CASCADE;
 ]   ALTER TABLE ONLY public.accessdeniedlist DROP CONSTRAINT fk_accessdeniedlist_multimediafile;
       public          admin    false    3564    226    216            �           2606    16854 )   accessdeniedlist fk_accessdeniedlist_user    FK CONSTRAINT     �   ALTER TABLE ONLY public.accessdeniedlist
    ADD CONSTRAINT fk_accessdeniedlist_user FOREIGN KEY (user_id) REFERENCES public."User"(user_id) ON UPDATE CASCADE ON DELETE CASCADE;
 S   ALTER TABLE ONLY public.accessdeniedlist DROP CONSTRAINT fk_accessdeniedlist_user;
       public          admin    false    216    234    3574                       2606    16776 4   filecategorygenre fk_categoryandgenre_multimediafile    FK CONSTRAINT     �   ALTER TABLE ONLY public.filecategorygenre
    ADD CONSTRAINT fk_categoryandgenre_multimediafile FOREIGN KEY (category_genre_id) REFERENCES public.categoryandgenre(category_genre_id);
 ^   ALTER TABLE ONLY public.filecategorygenre DROP CONSTRAINT fk_categoryandgenre_multimediafile;
       public          admin    false    222    3556    218                       2606    16804 !   comment fk_comment_multimediafile    FK CONSTRAINT     �   ALTER TABLE ONLY public.comment
    ADD CONSTRAINT fk_comment_multimediafile FOREIGN KEY (file_id) REFERENCES public.multimediafile(file_id) ON UPDATE CASCADE ON DELETE CASCADE;
 K   ALTER TABLE ONLY public.comment DROP CONSTRAINT fk_comment_multimediafile;
       public          admin    false    220    3564    226                       2606    16859    comment fk_comment_user    FK CONSTRAINT     �   ALTER TABLE ONLY public.comment
    ADD CONSTRAINT fk_comment_user FOREIGN KEY (user_id) REFERENCES public."User"(user_id) ON UPDATE CASCADE ON DELETE CASCADE;
 A   ALTER TABLE ONLY public.comment DROP CONSTRAINT fk_comment_user;
       public          admin    false    3574    220    234                       2606    16814 7   filecategorygenre fk_filecategorygenre_categoryandgenre    FK CONSTRAINT     �   ALTER TABLE ONLY public.filecategorygenre
    ADD CONSTRAINT fk_filecategorygenre_categoryandgenre FOREIGN KEY (category_genre_id) REFERENCES public.categoryandgenre(category_genre_id) ON UPDATE CASCADE ON DELETE CASCADE;
 a   ALTER TABLE ONLY public.filecategorygenre DROP CONSTRAINT fk_filecategorygenre_categoryandgenre;
       public          admin    false    222    3556    218                       2606    16809 5   filecategorygenre fk_filecategorygenre_multimediafile    FK CONSTRAINT     �   ALTER TABLE ONLY public.filecategorygenre
    ADD CONSTRAINT fk_filecategorygenre_multimediafile FOREIGN KEY (file_id) REFERENCES public.multimediafile(file_id) ON UPDATE CASCADE ON DELETE CASCADE;
 _   ALTER TABLE ONLY public.filecategorygenre DROP CONSTRAINT fk_filecategorygenre_multimediafile;
       public          admin    false    222    3564    226            	           2606    16771 4   filecategorygenre fk_multimediafile_categoryandgenre    FK CONSTRAINT     �   ALTER TABLE ONLY public.filecategorygenre
    ADD CONSTRAINT fk_multimediafile_categoryandgenre FOREIGN KEY (file_id) REFERENCES public.multimediafile(file_id);
 ^   ALTER TABLE ONLY public.filecategorygenre DROP CONSTRAINT fk_multimediafile_categoryandgenre;
       public          admin    false    222    226    3564                       2606    16819 )   multimediafile fk_multimediafile_filetype    FK CONSTRAINT     �   ALTER TABLE ONLY public.multimediafile
    ADD CONSTRAINT fk_multimediafile_filetype FOREIGN KEY (file_type_id) REFERENCES public.filetype(file_type_id);
 S   ALTER TABLE ONLY public.multimediafile DROP CONSTRAINT fk_multimediafile_filetype;
       public          admin    false    226    3560    224                       2606    16824 %   multimediafile fk_multimediafile_user    FK CONSTRAINT     �   ALTER TABLE ONLY public.multimediafile
    ADD CONSTRAINT fk_multimediafile_user FOREIGN KEY (uploader_id) REFERENCES public."User"(user_id) ON DELETE SET NULL;
 O   ALTER TABLE ONLY public.multimediafile DROP CONSTRAINT fk_multimediafile_user;
       public          admin    false    226    3574    234                       2606    16839 /   recommendation fk_recommendation_multimediafile    FK CONSTRAINT     �   ALTER TABLE ONLY public.recommendation
    ADD CONSTRAINT fk_recommendation_multimediafile FOREIGN KEY (recommended_file_id) REFERENCES public.multimediafile(file_id) ON UPDATE CASCADE ON DELETE CASCADE;
 Y   ALTER TABLE ONLY public.recommendation DROP CONSTRAINT fk_recommendation_multimediafile;
       public          admin    false    228    3564    226                       2606    16834 %   recommendation fk_recommendation_user    FK CONSTRAINT     �   ALTER TABLE ONLY public.recommendation
    ADD CONSTRAINT fk_recommendation_user FOREIGN KEY (user_id) REFERENCES public."User"(user_id) ON UPDATE CASCADE ON DELETE CASCADE;
 O   ALTER TABLE ONLY public.recommendation DROP CONSTRAINT fk_recommendation_user;
       public          admin    false    228    3574    234                       2606    16829 /   tagtomediafile fk_tagtomediafile_multimediafile    FK CONSTRAINT     �   ALTER TABLE ONLY public.tagtomediafile
    ADD CONSTRAINT fk_tagtomediafile_multimediafile FOREIGN KEY (file_id) REFERENCES public.multimediafile(file_id) ON UPDATE CASCADE ON DELETE CASCADE;
 Y   ALTER TABLE ONLY public.tagtomediafile DROP CONSTRAINT fk_tagtomediafile_multimediafile;
       public          admin    false    232    3564    226                       2606    16874 $   tagtomediafile fk_tagtomediafile_tag    FK CONSTRAINT     �   ALTER TABLE ONLY public.tagtomediafile
    ADD CONSTRAINT fk_tagtomediafile_tag FOREIGN KEY (tag_id) REFERENCES public.tag(tag_id) ON UPDATE CASCADE ON DELETE CASCADE;
 N   ALTER TABLE ONLY public.tagtomediafile DROP CONSTRAINT fk_tagtomediafile_tag;
       public          admin    false    3570    232    230                       2606    16869    User fk_user_userrole    FK CONSTRAINT     �   ALTER TABLE ONLY public."User"
    ADD CONSTRAINT fk_user_userrole FOREIGN KEY (role_id) REFERENCES public.userrole(role_id) ON DELETE RESTRICT;
 A   ALTER TABLE ONLY public."User" DROP CONSTRAINT fk_user_userrole;
       public          admin    false    234    236    3578                       2606    16849    View fk_view_multimediafile    FK CONSTRAINT     �   ALTER TABLE ONLY public."View"
    ADD CONSTRAINT fk_view_multimediafile FOREIGN KEY (file_id) REFERENCES public.multimediafile(file_id) ON DELETE SET NULL;
 G   ALTER TABLE ONLY public."View" DROP CONSTRAINT fk_view_multimediafile;
       public          admin    false    238    226    3564                       2606    16844    View fk_view_user    FK CONSTRAINT     �   ALTER TABLE ONLY public."View"
    ADD CONSTRAINT fk_view_user FOREIGN KEY (user_id) REFERENCES public."User"(user_id) ON DELETE SET NULL;
 =   ALTER TABLE ONLY public."View" DROP CONSTRAINT fk_view_user;
       public          admin    false    234    238    3574            �           2606    16694 1   accessdeniedlist multimediafile_accesscontrollist    FK CONSTRAINT     �   ALTER TABLE ONLY public.accessdeniedlist
    ADD CONSTRAINT multimediafile_accesscontrollist FOREIGN KEY (file_id) REFERENCES public.multimediafile(file_id);
 [   ALTER TABLE ONLY public.accessdeniedlist DROP CONSTRAINT multimediafile_accesscontrollist;
       public          admin    false    226    216    3564            
           2606    16699 2   filecategorygenre multimediafile_filecategorygenre    FK CONSTRAINT     �   ALTER TABLE ONLY public.filecategorygenre
    ADD CONSTRAINT multimediafile_filecategorygenre FOREIGN KEY (file_id) REFERENCES public.multimediafile(file_id);
 \   ALTER TABLE ONLY public.filecategorygenre DROP CONSTRAINT multimediafile_filecategorygenre;
       public          admin    false    226    222    3564                       2606    16704 '   multimediafile multimediafile_filetypes    FK CONSTRAINT     �   ALTER TABLE ONLY public.multimediafile
    ADD CONSTRAINT multimediafile_filetypes FOREIGN KEY (file_type_id) REFERENCES public.filetype(file_type_id);
 Q   ALTER TABLE ONLY public.multimediafile DROP CONSTRAINT multimediafile_filetypes;
       public          admin    false    226    224    3560                       2606    16786 ,   tagtomediafile multimediafile_tagtomediafile    FK CONSTRAINT     �   ALTER TABLE ONLY public.tagtomediafile
    ADD CONSTRAINT multimediafile_tagtomediafile FOREIGN KEY (file_id) REFERENCES public.multimediafile(file_id) ON DELETE CASCADE;
 V   ALTER TABLE ONLY public.tagtomediafile DROP CONSTRAINT multimediafile_tagtomediafile;
       public          admin    false    232    3564    226                       2606    16714 .   recommendation multimediafiles_recommendations    FK CONSTRAINT     �   ALTER TABLE ONLY public.recommendation
    ADD CONSTRAINT multimediafiles_recommendations FOREIGN KEY (recommended_file_id) REFERENCES public.multimediafile(file_id);
 X   ALTER TABLE ONLY public.recommendation DROP CONSTRAINT multimediafiles_recommendations;
       public          admin    false    3564    226    228                       2606    16719     View multimediafiles_userhistory    FK CONSTRAINT     �   ALTER TABLE ONLY public."View"
    ADD CONSTRAINT multimediafiles_userhistory FOREIGN KEY (file_id) REFERENCES public.multimediafile(file_id);
 L   ALTER TABLE ONLY public."View" DROP CONSTRAINT multimediafiles_userhistory;
       public          admin    false    226    3564    238                       2606    16766 $   multimediafile multimediafiles_users    FK CONSTRAINT     �   ALTER TABLE ONLY public.multimediafile
    ADD CONSTRAINT multimediafiles_users FOREIGN KEY (uploader_id) REFERENCES public."User"(user_id) ON UPDATE CASCADE;
 N   ALTER TABLE ONLY public.multimediafile DROP CONSTRAINT multimediafiles_users;
       public          admin    false    3574    226    234                       2606    16781 !   tagtomediafile tag_tagtomediafile    FK CONSTRAINT     �   ALTER TABLE ONLY public.tagtomediafile
    ADD CONSTRAINT tag_tagtomediafile FOREIGN KEY (tag_id) REFERENCES public.tag(tag_id) ON DELETE CASCADE;
 K   ALTER TABLE ONLY public.tagtomediafile DROP CONSTRAINT tag_tagtomediafile;
       public          admin    false    232    3570    230                        2606    16739 '   accessdeniedlist user_accesscontrollist    FK CONSTRAINT     �   ALTER TABLE ONLY public.accessdeniedlist
    ADD CONSTRAINT user_accesscontrollist FOREIGN KEY (user_id) REFERENCES public."User"(user_id);
 Q   ALTER TABLE ONLY public.accessdeniedlist DROP CONSTRAINT user_accesscontrollist;
       public          admin    false    3574    216    234                       2606    16734    userrole userroles_users    FK CONSTRAINT     }   ALTER TABLE ONLY public.userrole
    ADD CONSTRAINT userroles_users FOREIGN KEY (role_id) REFERENCES public."User"(user_id);
 B   ALTER TABLE ONLY public.userrole DROP CONSTRAINT userroles_users;
       public          admin    false    236    234    3574                       2606    16744     comment users_commentsandratings    FK CONSTRAINT     �   ALTER TABLE ONLY public.comment
    ADD CONSTRAINT users_commentsandratings FOREIGN KEY (user_id) REFERENCES public."User"(user_id);
 J   ALTER TABLE ONLY public.comment DROP CONSTRAINT users_commentsandratings;
       public          admin    false    234    3574    220                       2606    16754 $   recommendation users_recommendations    FK CONSTRAINT     �   ALTER TABLE ONLY public.recommendation
    ADD CONSTRAINT users_recommendations FOREIGN KEY (user_id) REFERENCES public."User"(user_id);
 N   ALTER TABLE ONLY public.recommendation DROP CONSTRAINT users_recommendations;
       public          admin    false    234    228    3574                       2606    16759    View users_userhistory    FK CONSTRAINT     }   ALTER TABLE ONLY public."View"
    ADD CONSTRAINT users_userhistory FOREIGN KEY (user_id) REFERENCES public."User"(user_id);
 B   ALTER TABLE ONLY public."View" DROP CONSTRAINT users_userhistory;
       public          admin    false    3574    234    238            �   �  x����n�0Ư��b/@��$v�ueݪU��I��dp!mwв������*��>���[���Z+x��Xk�IU�(�����'���C�?�¾.��x�M��Z<j#��2�8��Z�CU��dCѸ�������,�+�����5,�R<�1�j $��� !a)|.����EY�j@�T�v)�7*��F�,�/[i�B��ѯ5��L,]F@g����])cSX$\�Cр:H�v9�������0e3�jd�wv���KD�B�� ������pc�}�;�����E�b� �@��5�AB���M������.;�-ȜB�AȜa�G��Kev��0mL��#0��F`��~�[oi���ț�^JթW��`�AٸwGd��A�l�x[a5>�:mP���'��{{������9.�Au��]��.��+a�¢�d0��Y�OX�C���M0���M�)��N�.Tٹ퓨3?!���~;���F~�1��ϲ8Ҋ�Vh�XQ���6�o��C���8�ᬕ�<m��2:��KQȰ����k�0�N�a� N~%/�`X;:>�t�a1g8�EYJ��fe��lm||�[m��[<���s�c��\=;#��)6{��~&}%2���늾�fhU1��Hg���c��      �   g  x�}�ۍ$!E��(6�Ya��'��?��M=hd,��q�i�ʐ@f��?P���k�&[7�/���!�%%�zHIM�2^Ғ���Kz�u�/I�C�%�t=_9��i�ba����
\T %Xe�"J�U.:�&X��"Z�U	.J�'X��"F�U-Z��bP��G��W������������TC�y�]E@�P�������>�	j������������,�_�띵r��<���o���pc�>������%!�*�p����Ol��#������apl�:�~���q�
1op�� ��0��(��JP�ՠJkQ�>��U�i:b�~���|�@��:���<��Š�נJoQ�UQ��r��)�@�~�A�@�(<���w;�A���UFT��*��*A� S�K�pT5��@�v�ny��2��@�F�.�!(�6�)����j�J��Su��TC�1�^�2��L���{���H�hJ��4����H��`��)٥���M�����O&T���	���6�PS�'d/:!{a��	�2>)ٺ�J	Ĕ��Vt&���+Ek�RJ�־y���2��o��V���lӻo������j�8�      �   y   x�E��	!D�uu0���2���ϔ(-nJ��( �u�Q�gg4����+������;� C�����*������-De�A*㸦�yMe��kN���&xS���o^��5uy~f�A�5�      �   �  x�e��n�0Ek�+�c��W$�"[�܆�9�[2H�Y�}(�3)��%��=����A]��sI�iD��@nu�^Ia¹v�;�Z�D����{*a�(�\Oǧ��e�H���p�e��:E@T�4U�	��
�XK#.q8A9+e8S�K9���t�1(� �$邚J���t��Z��r�Z�qL=I��^�!+�\�/b�I��V�lrW���ro�9��W+���~ϑ�b^��O �̔�N;�P��E%嵌kU�e&n��4R��n�-eFl_f;��=cV���/�6�R�)�h%�q�c5��t�s�Okn�Ҟ�E��7��)M�ײB��"[$�借6�z:�N��[C���X��w2��j�����b,9�v�o��n{��      �   M  x��V�n�F]��b�w��)y�&MQ����n(zl�H���.v�$(�t�M� kU�?b�f���^��iK���{�9瞙�#|���X�dm�[��"�����Eo�A��p�wY�F:�3��r�d��i��d���]�a�V�*5^�Q� ��	D���Ve>T���P��׏U:���v�8��2��L����kU:٨҆f��	�Aˇ��,�t<ء�5���pm��(ے?�u5]��,G��	T�'�b�*KU�-���r�r�P���N��%uC/��y�佨ؒ�g��@��4��C�Q��>$�L*��l8u �G�u�*6���̻ϨwӪ��9+��P8�#�syL�]ᒁ�ݥ�e����=ᒇ���L;5�F^/քKn6k\Z�����v�h����.9�,���(:�iw�� ��-�C�X��D�����!�e+�_i���*J�#�J�e_�H��  ��J�;i���Z���vD�'ZF���U�S�+�x+7�L����M�W0�X7�C\n��6 ��:��`<N� W�J�:b&�$�[�.�D�I��Y�_G*�ph�Jn��iqG� �i^ۧ��I�ܾ1gfl&�ĜJ�?O�9�F)�����=6c�o_������e�vόi�������]sd��|B�s����gh�_�m�㾟���>ᇙHs��� <c�!>N�r���?0g��ݗ�c]>�=�O�ao� ���|(y�9��߽�`��Y���v���?�&�^5���tZ��.����"���w�͔�7ν�>��� g���n��S�@p�{4���ы�+����@�1�3aq!m�����EAE�2yc�<����(�8�̟��3f��
I^�	�KG� #��>BU�^�B$>�2�2.`�l:���"��"�;¯�ڢ�Z��ԥh2a�67ERT�1;>�/H�OH_c1�9a��v���:�����M�u�t-�qc���>�f>0A8g�`��IT��1��]'�H���H3���C��n�ss��]��h�r��׶���vd�5���2m�b�n�_��t���`�;�pA�w��D�L�d�;#R��-��*p�x[��>���~�n|���x"�Y�7%���c�"�����9sc������A��:_�@����_�-���R��F�g)9��|!�!X�@�g����y�4��沯�=l�T}^�C�9���ݷ "D1��=^�`�M�b�>W|��	1��R�B�L9�X�·�{h��ӺhX@@�Z �_"aH!���t���ctm�7��G��܃�s�����t�1	�      �   �   x���0�jk���P�w��sDH�#
��+,V�����=�L���d�SܧyP�ZTQ�z���X�V+Hӊ�����$�L6`>��7�P/\
���p�p�b^p.�E��"��v����Us��,}?f���**      �   0   x�3���MLO�2��LI��2�t,M���2�t�O.�M�+����� �g
�      �   �  x����N�0E��W�-��뼕v�h�Dh$$dRO�i�D� ���1i������D{V�>޶O 7�+���U	�;��YQ�����gM��dQ�e�Ϫ3��G!t�8��@�3r�<��	t�K)�+���ed�S�z(>�v�����>߲�2��B1 ��ᩩX�<��
�����1�7 �5e�J������U�ĕ]��.@�/`���vd��j�;��<�_XF��.cG	�xt@|0(>��]|���V|ԉ�m���_��B���j@pP�һ{ �x0zЕ��v��u��:#��gˤ>��a������{���!L;��iڼ��FR�@4�?�H��U?v�#fy�d��p\,���E�����N��-mh,��-$8}!
��<��k;3D�,����?�Y�:�:����Nz���8y 1�{��Ä@;����n2���WZ%D#h��@5�&�?0�f@g��`���|�N�&��� �(;a�@hz>�!�X��g���i0�Zx������%@`�����M�Ǹ�?MX�Z����E�2u���٣\s}�M�������~P"�Y�>B��y��Qq1�!m:�� �4.,F�d$w4%�/o��Ih��ۡ\WlA/V���1,��;���3��X�;�!�=��Y"�i=\�K��t�V;��n	_è	�f�+��Rմ�SRYg�@K�"��й9sI���"�1
�ɐ|e%94�DڞW̮��;vF㼴0���WsZU�y���$j��������}mO_+��J�f��InC�;��9�R��|y�
��V��8��f�J��kQ����h}]2�\��tNx��9�q�`�A�q�pd}%3��=������x�m�o|��isz%N�c���'''�(�5Q      �   _  x�uRٕ$1�6Q8���8|Ų�Ǳ��)��l?�WI !@�EX�b\�ʼ�GR�Hi&|0-���^��
����K>�7(�{:y*����c�/e��<X�<<`���jb��8&���-:.q(��k���G�W/ �H�U��J|g\�c�o���*HK��w|��*��Rv�a<�#�V�3"�-ݧN����B��=ܤA3k�w�\�o�ֻR�71=y�,��b�=��܍s'�_��X�����?��M�� �L�����/F��J����bZ�m�C|r�<z��$U7%Ɂ�M/Iqi��.K�N���hƝ$oI✞fȍ�$��A���N����D��Q�X      �   �   x�%O�n�0;K3����d��v�\!1j[����O�n$%���oҥ1z�Zz�x�5I�|J\
W����-K�x��XM|{�j*��� 4�;��M����Ι5Ŏ�AXT�hZ�������gb�2��dT��̍^��0P��R��.0$�l2��
�(UC7���ݒ�0Ry�:�?�(�zgH���al�X�#�[̻fe�FƟD���Tt      �   F   x����0B�3�Yl���_G��B_�D�2a�g.��1\��22]*m���s͔��ڰ�C�^�K      �   _   x�M��� Dk�aL���a[+
��hBT��n#�X���޻Za�����#5�4e�_i�^j���,��/���1��ʟ���<��B|     