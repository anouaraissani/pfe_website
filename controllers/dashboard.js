
const { getConnection, connect } = require('../db/connect')
const {queryCA1, queryCA2, queryCA3, q} = require('../queries')

const dashboard = async (req, res) => {
    const user = await req.user
    console.log('the user name: ',user.name)
    res.render('index.ejs', { name: user.name })
} 

const dashboardCA = async (req, res) => {
    const user = await req.user;
    console.log('the user name: ', user.name);
    res.render('dashboards/dashboard_CA.ejs', { name: user.name });
  };

// Query the database and fetch data
const fetchDataCA= async (req, res) =>{
    try {
        await connect()
        const connection = await getConnection()
        //fetch the data from the database
        const result1 = await connection.execute(queryCA1)
        const result2 = await connection.execute(queryCA2)
        //put years values in an array
        const yearArray = result1.rows.map(row => row[0]);
        // create CA_annee_mois vaiable that contains "CA par mois pour chaque année"
        const CA_annee_mois = {}
        for (const annee of yearArray) {
            const d = await connection.execute(q);
            CA_annee_mois[annee] = d;
        } 
        // create CA_annee_trimestre vaiable that contains "CA par trimestre pour chaque année"
        const CA_annee_trimestre = {}
        for (const annee of yearArray) {
            const d = await connection.execute(queryCA3, {annee});
            CA_annee_trimestre[annee] = d;
        }  
        await connection.close()
        // --------------------------------------------------------------------------------------------------
        //GRAPH 1
        // --------------------------------------------------------------------------------------------------
        // CA par année
        const CA_annee = result1.rows.map(row => {
            return {
                'annee': parseInt(row[0]),
                'ca': row[1]
            };
        });

        // data1: for each year: total revenue + the revenue for each month
        const data1 = CA_annee.map(item => ({
            annee: item.annee,
            ca: item.ca,
            moisData: CA_annee_mois[item.annee.toString()].rows.map(row => ({
                mois: row[0],
                ca: row[1]
            }))
        }));
        // console.log('mergeddata bb:', data1);
        // --------------------------------------------------------------------------------------------------
        //GRAPH 2
    
        const data2 = {
            labels: result2.rows.map(row => row[0]),
            datasets: [{
                data: result2.rows.map(row => row[1])
            }]
        };
        // --------------------------------------------------------------------------------------------------
        // GRAPH 3 
        const datasets = [];

        for (let i = 1; i <= 4; i++) {
        const quarterData = {
            label: `T${i}`,
            data: Object.values(CA_annee_trimestre).map((yearData) => {
            const rows = yearData.rows;
            const row = rows.find((r) => r[0] === i);
            return row ? row[1] : 0;
            }),
        };
        datasets.push(quarterData);
        }   
        const data3 = {
            labels: yearArray,
            datasets: datasets
        };
        const data = {
            data1: data1,
            data2: data2,
            data3: data3
        };
        console.log('fetch data:',data)
        res.json(data);
    }catch (error) {
        console.error(error);
    }
}

module.exports={dashboard, dashboardCA, fetchDataCA}