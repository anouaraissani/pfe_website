// ----------------------------------------------------
// DASHBOARD REGLEMENTS 
/* =================================     CUMULE       ============================= */

const queryR1 = `
    SELECT
    SUM(CASE WHEN D.ANNEE = EXTRACT (YEAR FROM CURRENT_DATE) -1 THEN REGL.MONTREGL ELSE 0 END) AS regl_annee_en_cours,
    SUM(CASE WHEN D.ANNEE =  EXTRACT (YEAR FROM CURRENT_DATE) - 2 THEN REGL.MONTREGL ELSE 0 END) AS regl_annee_prec
    FROM
    FAIT_REGLEMENT REGL, DIM_DATE D
    WHERE
    REGL.DATE_KEY = D.DATE_KEY
    AND D.MOIS < EXTRACT(MONTH FROM CURRENT_DATE)
    `
const queryR1Exception = `
    SELECT
    SUM(CASE WHEN D.ANNEE = EXTRACT (YEAR FROM CURRENT_DATE) -2 THEN REGL.MONTREGL  ELSE 0 END) AS regl_annee_en_cours,
    SUM(CASE WHEN D.ANNEE =  EXTRACT (YEAR FROM CURRENT_DATE) - 3 THEN REGL.MONTREGL ELSE 0 END) AS regl_annee_prec
    FROM
    FAIT_REGLEMENT REGL, DIM_DATE D
    WHERE
    REGL.DATE_KEY = D.DATE_KEY
    AND D.MOIS <= 12
    `
const queryR2 = `
    SELECT
    INTER.LIBTYPIN,
    SUM(CASE WHEN D.ANNEE = EXTRACT(YEAR FROM CURRENT_DATE) - 1 THEN REGL.MONTREGL ELSE 0 END) AS regl_annee_en_cours,
    SUM(CASE WHEN D.ANNEE = EXTRACT(YEAR FROM CURRENT_DATE) - 2 THEN REGL.MONTREGL ELSE 0 END) AS regl_annee_prec
    FROM
        FAIT_REGLEMENT REGL, DIM_INTERMEDIAIRE inter, DIM_DATE d
    WHERE
        REGL.INTERMEDIAIRE_KEY = INTER.INTERMEDIAIRE_KEY
        AND REGL.DATE_KEY = d.DATE_KEY
        AND D.MOIS < EXTRACT(MONTH FROM CURRENT_DATE) 
    GROUP BY
        INTER.LIBTYPIN
    ORDER BY
        regl_annee_prec DESC
    `
const queryR2Exception =  `
    SELECT
    INTER.LIBTYPIN,
    SUM(CASE WHEN D.ANNEE = EXTRACT(YEAR FROM CURRENT_DATE) -2 THEN REGL.MONTREGL  ELSE 0 END) AS regl_annee_en_cours,
    SUM(CASE WHEN D.ANNEE = EXTRACT(YEAR FROM CURRENT_DATE)-3 THEN REGL.MONTREGL  ELSE 0 END) AS regl_annee_prec
    FROM
        FAIT_REGLEMENT REGL, DIM_INTERMEDIAIRE inter, DIM_DATE d
    WHERE
        REGL.INTERMEDIAIRE_KEY = INTER.INTERMEDIAIRE_KEY
        AND REGL.DATE_KEY = d.DATE_KEY
        AND D.MOIS <= 12
    GROUP BY
        INTER.LIBTYPIN
    ORDER BY
        regl_annee_prec DESC
    `
const queryR3 = `
    SELECT CAT.libebran,
    SUM(CASE WHEN D.ANNEE = EXTRACT(YEAR FROM CURRENT_DATE) -1 THEN REGL.MONTREGL ELSE 0 END) AS regl_annee_en_cours,
    SUM(CASE WHEN D.ANNEE = EXTRACT(YEAR FROM CURRENT_DATE)-2 THEN REGL.MONTREGL ELSE 0 END) AS regl_annee_prec
    FROM
        FAIT_REGLEMENT REGL, DIM_CATEGORIE CAT, DIM_DATE d 
    WHERE
        REGL.CATEGORIE_KEY = CAT.CATEGORIE_KEY
        AND REGL.DATE_KEY = d.DATE_KEY
        AND D.MOIS < EXTRACT (MONTH FROM CURRENT_DATE ) 
    GROUP BY
        CAT.libebran
    ORDER BY
    regl_annee_prec ASC
    `    
const queryR3Exception = `
    SELECT CAT.libebran,
    SUM(CASE WHEN D.ANNEE = EXTRACT(YEAR FROM CURRENT_DATE)-2 THEN REGL.MONTREGL ELSE 0 END) AS regl_annee_en_cours,
    SUM(CASE WHEN D.ANNEE = EXTRACT(YEAR FROM CURRENT_DATE)-3 THEN REGL.MONTREGL ELSE 0 END) AS regl_annee_prec
    FROM
        FAIT_REGLEMENT REGL, DIM_CATEGORIE CAT, DIM_DATE d 
    WHERE
        REGL.CATEGORIE_KEY = CAT.CATEGORIE_KEY
        AND REGL.DATE_KEY = d.DATE_KEY
        AND D.MOIS <= 12
    GROUP BY
        CAT.libebran
    ORDER BY
    regl_annee_prec ASC
    `
const queryR4  = `
    SELECT D.ANNEE, D.LIBMOIS, CAT.LIBECATE, INTER.LIBTYPIN ,  sum( REGL.MONTREGL  )  as s
    FROM FAIT_REGLEMENT REGL, DIM_INTERMEDIAIRE inter, DIM_CATEGORIE cat, DIM_DATE d
    WHERE REGL.CATEGORIE_KEY = CAT.CATEGORIE_KEY
    AND REGL.INTERMEDIAIRE_KEY = INTER.INTERMEDIAIRE_KEY
    AND  REGL.DATE_KEY =  D.DATE_KEY
    AND D.MOIS < EXTRACT (MONTH from CURRENT_DATE)
    AND D.ANNEE = EXTRACT (YEAR FROM CURRENT_DATE) -1
    GROUP BY D.ANNEE, D.LIBMOIS, CAT.LIBECATE, INTER.LIBTYPIN
    ORDER BY s desc
    `
const queryR4Exception = `
    SELECT D.ANNEE, D.LIBMOIS, CAT.LIBECATE, INTER.LIBTYPIN , sum( REGL.MONTREGL)  as s
    FROM FAIT_REGLEMENT REGL, DIM_INTERMEDIAIRE inter, DIM_CATEGORIE cat, DIM_DATE d
    WHERE REGL.CATEGORIE_KEY = CAT.CATEGORIE_KEY
    AND REGL.INTERMEDIAIRE_KEY = INTER.INTERMEDIAIRE_KEY
    AND  REGL.DATE_KEY =  D.DATE_KEY
    AND D.MOIS <= 12
    AND D.ANNEE = EXTRACT (YEAR FROM CURRENT_DATE) -2
    GROUP BY D.ANNEE, D.LIBMOIS, CAT.LIBECATE, INTER.LIBTYPIN
    ORDER BY s desc
    `
const queryR5 = `
    SELECT ((regl_annee_en_cours - regl_annee_prec) / regl_annee_prec) AS pourcentage
    FROM (
       SELECT
        SUM(CASE WHEN D.ANNEE = EXTRACT (YEAR FROM CURRENT_DATE) -1 THEN REGL.MONTREGL  ELSE 0 END) AS regl_annee_en_cours,
        SUM(CASE WHEN D.ANNEE =  EXTRACT (YEAR FROM CURRENT_DATE) - 2 THEN REGL.MONTREGL ELSE 0 END) AS regl_annee_prec
        FROM
        FAIT_REGLEMENT REGL, DIM_DATE D
        WHERE
        REGL.DATE_KEY = D.DATE_KEY
        AND D.MOIS <= 12  
        )`
const queryR5Exception = `
    SELECT ((regl_annee_en_cours - regl_annee_prec) / regl_annee_prec) AS pourcentage
    FROM (
    SELECT
    SUM(CASE WHEN D.ANNEE = EXTRACT (YEAR FROM CURRENT_DATE) -2 THEN REGL.MONTREGL  ELSE 0 END) AS regl_annee_en_cours,
    SUM(CASE WHEN D.ANNEE =  EXTRACT (YEAR FROM CURRENT_DATE) - 3 THEN REGL.MONTREGL ELSE 0 END) AS regl_annee_prec
    FROM
    FAIT_REGLEMENT REGL, DIM_DATE D
    WHERE
    REGL.DATE_KEY = D.DATE_KEY
    AND D.MOIS <= 12  
    )
    `
/* =================================     MOIS       ============================= */

const queryR1Mois = `
    SELECT
    SUM(CASE WHEN D.ANNEE = EXTRACT (YEAR FROM CURRENT_DATE) -1 THEN REGL.MONTREGL ELSE 0 END) AS regl_annee_en_cours,
    SUM(CASE WHEN D.ANNEE =  EXTRACT (YEAR FROM CURRENT_DATE) - 2 THEN REGL.MONTREGL ELSE 0 END) AS regl_annee_prec
    FROM
    FAIT_REGLEMENT REGL, DIM_DATE D
    WHERE
    REGL.DATE_KEY = D.DATE_KEY
    AND D.MOIS = EXTRACT(MONTH FROM CURRENT_DATE) - 1
    `
const queryR1MoisException = `
    SELECT
    SUM(CASE WHEN D.ANNEE = EXTRACT (YEAR FROM CURRENT_DATE) -2 THEN REGL.MONTREGL   ELSE 0 END) AS regl_annee_en_cours,
    SUM(CASE WHEN D.ANNEE =  EXTRACT (YEAR FROM CURRENT_DATE) - 3 THEN REGL.MONTREGL  ELSE 0 END) AS regl_annee_prec
    FROM
    NODE.FAIT_REGLEMENT REGL, NODE.DIM_DATE D
    WHERE
    REGL.DATE_KEY = D.DATE_KEY
    AND D.MOIS = 12
    `
const queryR2Mois = `
    SELECT
    INTER.LIBTYPIN,
    SUM(CASE WHEN D.ANNEE = EXTRACT(YEAR FROM CURRENT_DATE) - 1 THEN REGL.MONTREGL  ELSE 0 END) AS regl_annee_en_cours,
    SUM(CASE WHEN D.ANNEE = EXTRACT(YEAR FROM CURRENT_DATE) - 2 THEN REGL.MONTREGL ELSE 0 END) AS regl_annee_prec
    FROM
        NODE.FAIT_REGLEMENT REGL, NODE.DIM_INTERMEDIAIRE inter, NODE.DIM_DATE d
    WHERE
        REGL.INTERMEDIAIRE_KEY = INTER.INTERMEDIAIRE_KEY
        AND REGL.DATE_KEY = d.DATE_KEY
        AND D.MOIS = EXTRACT(MONTH FROM CURRENT_DATE) - 1
    GROUP BY
        INTER.LIBTYPIN
    ORDER BY
        regl_annee_prec DESC
    `
const queryR2MoisException =  `
    SELECT
    INTER.LIBTYPIN,
    SUM(CASE WHEN D.ANNEE = EXTRACT(YEAR FROM CURRENT_DATE) -2 THEN REGL.MONTREGL  ELSE 0 END) AS regl_annee_en_cours,
    SUM(CASE WHEN D.ANNEE = EXTRACT(YEAR FROM CURRENT_DATE)-3 THEN REGL.MONTREGL ELSE 0 END) AS regl_annee_prec
    FROM
        NODE.FAIT_REGLEMENT REGL, NODE.DIM_INTERMEDIAIRE inter, NODE.DIM_DATE d
    WHERE
        REGL.INTERMEDIAIRE_KEY = INTER.INTERMEDIAIRE_KEY
        AND REGL.DATE_KEY = d.DATE_KEY
        AND D.MOIS = 12
    GROUP BY
        INTER.LIBTYPIN
    ORDER BY
        regl_annee_prec DESC
    `
const queryR3Mois = `
    SELECT CAT.libebran,
    SUM(CASE WHEN D.ANNEE = EXTRACT(YEAR FROM CURRENT_DATE) -1 THEN REGL.MONTREGL  ELSE 0 END) AS regl_annee_en_cours,
    SUM(CASE WHEN D.ANNEE = EXTRACT(YEAR FROM CURRENT_DATE)-2 THEN REGL.MONTREGL  ELSE 0 END) AS regl_annee_prec
    FROM
        NODE.FAIT_REGLEMENT REGL, NODE.DIM_CATEGORIE CAT, NODE.DIM_DATE d 
    WHERE
        REGL.CATEGORIE_KEY = CAT.CATEGORIE_KEY
        AND REGL.DATE_KEY = d.DATE_KEY
        AND D.MOIS = EXTRACT (MONTH FROM CURRENT_DATE ) -1
    GROUP BY
        CAT.libebran
    ORDER BY
    regl_annee_prec ASC
    `    
const queryR3MoisException = `
    SELECT CAT.libebran,
    SUM(CASE WHEN D.ANNEE = EXTRACT(YEAR FROM CURRENT_DATE)-2 THEN REGL.MONTREGL  ELSE 0 END) AS regl_annee_en_cours,
    SUM(CASE WHEN D.ANNEE = EXTRACT(YEAR FROM CURRENT_DATE)-3 THEN REGL.MONTREGL ELSE 0 END) AS regl_annee_prec
    FROM
        NODE.FAIT_REGLEMENT REGL, NODE.DIM_CATEGORIE CAT, NODE.DIM_DATE d 
    WHERE
        REGL.CATEGORIE_KEY = CAT.CATEGORIE_KEY
        AND REGL.DATE_KEY = d.DATE_KEY
        AND D.MOIS = 12
    GROUP BY
        CAT.libebran
    ORDER BY
    regl_annee_prec ASC
    `
const queryR4Mois  = `
    SELECT D.ANNEE, D.LIBMOIS, CAT.LIBECATE, INTER.LIBTYPIN ,  sum( REGL.MONTREGL  )  as s
    FROM NODE.FAIT_REGLEMENT REGL, NODE.DIM_INTERMEDIAIRE inter, NODE.DIM_CATEGORIE cat, NODE.DIM_DATE d
    WHERE REGL.CATEGORIE_KEY = CAT.CATEGORIE_KEY
    AND REGL.INTERMEDIAIRE_KEY = INTER.INTERMEDIAIRE_KEY
    AND  REGL.DATE_KEY =  D.DATE_KEY
    AND D.MOIS = EXTRACT (MONTH from CURRENT_DATE) -1
    AND D.ANNEE = EXTRACT (YEAR FROM CURRENT_DATE) -1
    GROUP BY D.ANNEE, D.LIBMOIS, CAT.LIBECATE, INTER.LIBTYPIN
    ORDER BY s desc 
    `
const queryR4MoisException = `
    SELECT D.ANNEE, D.LIBMOIS, CAT.LIBECATE, INTER.LIBTYPIN , sum( REGL.MONTREGL )  as s
    FROM NODE.FAIT_REGLEMENT REGL, NODE.DIM_INTERMEDIAIRE inter, NODE.DIM_CATEGORIE cat, NODE.DIM_DATE d
    WHERE REGL.CATEGORIE_KEY = CAT.CATEGORIE_KEY
    AND REGL.INTERMEDIAIRE_KEY = INTER.INTERMEDIAIRE_KEY
    AND  REGL.DATE_KEY =  D.DATE_KEY
    AND D.MOIS = 12
    AND D.ANNEE = EXTRACT (YEAR FROM CURRENT_DATE) -2
    GROUP BY D.ANNEE, D.LIBMOIS, CAT.LIBECATE, INTER.LIBTYPIN
    ORDER BY s desc
    `
const queryR5Mois = `
    SELECT ((regl_annee_en_cours - regl_annee_prec) / regl_annee_prec) AS pourcentage
    FROM (
       SELECT
        SUM(CASE WHEN D.ANNEE = EXTRACT (YEAR FROM CURRENT_DATE) -1 THEN REGL.MONTREGL  ELSE 0 END) AS regl_annee_en_cours,
        SUM(CASE WHEN D.ANNEE =  EXTRACT (YEAR FROM CURRENT_DATE) - 2 THEN REGL.MONTREGL ELSE 0 END) AS regl_annee_prec
        FROM
        FAIT_REGLEMENT REGL, DIM_DATE D
        WHERE
        REGL.DATE_KEY = D.DATE_KEY
        AND D.MOIS = 12  
        )`
const queryR5MoisException = `
    SELECT ((regl_annee_en_cours - regl_annee_prec) / regl_annee_prec) AS pourcentage
    FROM (
    SELECT
    SUM(CASE WHEN D.ANNEE = EXTRACT (YEAR FROM CURRENT_DATE) -2 THEN REGL.MONTREGL  ELSE 0 END) AS regl_annee_en_cours,
    SUM(CASE WHEN D.ANNEE =  EXTRACT (YEAR FROM CURRENT_DATE) - 3 THEN REGL.MONTREGL ELSE 0 END) AS regl_annee_prec
    FROM
    FAIT_REGLEMENT REGL, DIM_DATE D
    WHERE
    REGL.DATE_KEY = D.DATE_KEY
    AND D.MOIS = 12  
    )
    `
module.exports={queryR1, queryR1Exception, queryR2, queryR2Exception, queryR3, queryR3Exception , queryR4, queryR4Exception,
                queryR1Mois, queryR1MoisException, queryR2Mois, queryR2MoisException, queryR3Mois, queryR3MoisException , queryR4Mois, queryR4MoisException,
                queryR5, queryR5Exception, queryR5Mois, queryR5MoisException }