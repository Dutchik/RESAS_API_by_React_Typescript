///////////////////////////////////////////////////////////////////////////////
//
//CheckBox.tsx              checkboxを生成するコンポーネント
//Graph.tsx                 graphを生成するコンポーネント
//              highcharts
//              highcharts-react-official
//              を仕様しています
//handleClickCheck.tsx       データを取得して整理するコンポーネント
//api_req.tsx                APIからデータを取得するコンポーネント                   
//
///////////////////////////////////////////////////////////////////////////////
import React, { useEffect, useState } from "react";
import CheckBox from "./CheckBox";
import Graph from "./Graph";
import handleCheckClick from "./handleClickCheck";
import fetchData from './api_req';
///////////////////////////////////////////////////////////////////////////////
//
//URLの記述          :fetchData関数にはURLを引数に持つので受け取りたい内容に合わせて変更してください;
//apiUrl            :resasAPIで都道府県名とコードを入手出来ます;
//api_population    :prefCodeを加えて、その都道府県の人口データを取得します;
//
///////////////////////////////////////////////////////////////////////////////
const apiUrl = 'https://opendata.resas-portal.go.jp/api/v1/prefectures';                                            //APIの呼び出しURL
const api_population = "https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?prefCode=";       //人口データを呼び出すURL
///////////////////////////////////////////////////////////////////////////////
//
//CSSの記述
//
///////////////////////////////////////////////////////////////////////////////
const Styles: { [key: string]: React.CSSProperties } = {
    label: {
        fontSize: "50px",
        padding: "0.5rem 2rem",
        borderLeft: "4px solid #000",
        marginLeft: "10px",
    },
    checkerea: {
        fontSize: "30px",
        padding: "0.5rem 2rem",
        border: "4px solid #000",
        marginLeft: "10px",
    },
    select: {
        fontSize: "20px",
        height: "40px",
        width: "150px",
    },
};
///////////////////////////////////////////////////////////////////////////////
//
//Mainに関する記述
//fetchDataで都道府県データ取得 →   setPrefectures{message: null;result: {prefCode: number;prefName: string;}[]}に入れる
//
//
//handleCheckClick                            checkBoxが押されたときに発火します
//仕様       引数                                   説明                                  
//          api_population + String(prefCode)     :都道府県のコードを加えたURL              
//          selectedData                          :selectで選択した内容,デフォルトで総人口 　
//          prefPopulation                        :取得された都道府県データを入れます
//          setPrefPopulation                     :取得された都道府県データを入れますsetするのに使います
//          prefName                              ：都道府県名    
//          prefCode                              :都道府県コード    
//          check                                 :クリックに関する         
//
//
//handleDataChange                          selectで選択した内容を記録します
//
//
//Graph                                     Graph.tsxに記述されています
//          prefName                        prefPopulationに含まれるデータからselect
//          data[year, data]                で選択されたlabelの配列と都道府県名を引数として渡します
///////////////////////////////////////////////////////////////////////////////
const Main = () => {
    /*==============================================================================*/
    //      prefectures, setPrefectures、prefPopulation, setPrefPopulation設定
    /*==============================================================================*/
    const [prefectures, setPrefectures] = useState<{
        message: null;
        result: {
            prefCode: number;               /*都道府県ごとの固有の番号*/
            prefName: string;               /*都道府県の名前*/
        }[] | null;
    } | null>(null);

    const [prefPopulation, setPrefPopulation] = useState<
        { 
            prefName: string;                /*都道府県ごとの固有の番号*/
            data: { label: string;           /*データの種類*/
                   data: { year: number;     /*データの年*/
                          value: number;     /*人口データ*/
                         }[]; }[] }[]
    >([]);
    const [selectedData, setSelectedData] = useState("総人口");         /*selectedDataの初期値を設定*/
    /*==============================================================================*/
    //      fetchDataで都道府県の名前とコード取得
    /*==============================================================================*/
    useEffect(() => {
        fetchData(apiUrl)
            .then((results) => {
                setPrefectures(results);
            })
            .catch((error) => { });
    }, []);
    /*==============================================================================*/
    //      押されたcheckboxによってデータを取得する
    /*==============================================================================*/
    const handleCheck = (prefName: string, prefCode: number, check: boolean) => {
        handleCheckClick(api_population + String(prefCode), selectedData, prefPopulation, setPrefPopulation, prefName, prefCode, check);
    };
    /*==============================================================================*/
    //       selectの変更
    /*==============================================================================*/
    const handleDataChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        setSelectedData(selectedValue);
    };
    /*==============================================================================*/
    //
    /*==============================================================================*/
    return (
        <main>
            <div>
                <h1 style={Styles.label}>Resas_APIを使ったwebアプリケーションの実装</h1>
                <h3>checkboxでチェックされた県の情報をグラフで表示出来ます</h3>
                <h3>デフォルトで総人口を表示させています、内容の変更に関しては＜select＞の変更をしてください</h3>
                {prefectures && (
                    <div style={Styles.checkerea}>
                        <CheckBox
                            prefectures={prefectures.result || []}
                            onChange={handleCheck}
                        />
                    </div>
                )}
            </div>
            <div>
                <label>
                    <select value={selectedData} onChange={handleDataChange} style={Styles.select}>
                        <option value="総人口">総人口</option>
                        <option value="年少人口">年少人口</option>
                        <option value="生産年齢人口">生産年齢人口</option>
                        <option value="老年人口">老年人口</option>
                    </select>
                </label>
            </div>
            <div>
                {selectedData === "総人口" ? (
                    <Graph populationdata={prefPopulation.map((pref) => ({
                        prefName: pref.prefName,
                        data: (pref.data.find((item) => item.label === "総人口")?.data) || []
                    }))} />
                ) : null}

                {selectedData === "年少人口" ? (
                    <Graph populationdata={prefPopulation.map((pref) => ({
                        prefName: pref.prefName,
                        data: (pref.data.find((item) => item.label === "年少人口")?.data) || []
                    }))} />
                ) : null}


                {selectedData === "生産年齢人口" ? (
                    <Graph populationdata={prefPopulation.map((pref) => ({
                        prefName: pref.prefName,
                        data: (pref.data.find((item) => item.label === "生産年齢人口")?.data) || []
                    }))} />
                ) : null}


                {selectedData === "老年人口" ? (
                    <Graph populationdata={prefPopulation.map((pref) => ({
                        prefName: pref.prefName,
                        data: (pref.data.find((item) => item.label === "老年人口")?.data) || []
                    }))} />
                ) : null}

            </div>
        </main>
    );
};
///////////////////////////////////////////////////////////////////////////////
//
//
//
///////////////////////////////////////////////////////////////////////////////
export default Main;
///////////////////////////////////////////////////////////////////////////////
//
//EOF
//
///////////////////////////////////////////////////////////////////////////////
