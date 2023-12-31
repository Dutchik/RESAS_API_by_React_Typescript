//////////////////////////////////////////////////////////////////////////////
//
//
//
//////////////////////////////////////////////////////////////////////////////
import React, { useState, useEffect } from 'react';
const apiKey = process.env.REACT_APP_API_KEY;
//const apiUrl = 'https://opendata.resas-portal.go.jp/api/v1/prefectures';
///////////////////////////////////////////////////////////////////////////////
//
//APIからデータを持ってくる関数の定義
//fetchData(/*用途に応じて任意で設定*/)
//      戻り値：APIからのデータ；
///////////////////////////////////////////////////////////////////////////////
async function fetchData(x: string) {
    try {
        const response = await fetch(x, {
            method: "GET",
            headers: { "X-API-KEY": `${apiKey}` }
        });
        if (!response.ok) {
            throw new Error('データの取得に失敗しました');
        }
        const result = await response.json();
        return result;

    } catch (error) {
        console.error(error);
    }
}
//////////////////////////////////////////////////////////////////////////////
//
//
//
//////////////////////////////////////////////////////////////////////////////
export default fetchData;
//////////////////////////////////////////////////////////////////////////////
//
//EOF
//
//////////////////////////////////////////////////////////////////////////////
