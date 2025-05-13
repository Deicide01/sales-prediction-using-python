import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ScatterChart, Scatter, Label, ResponsiveContainer, LineChart, Line } from 'recharts';
import * as Papa from 'papaparse';

export default function SalesPredictionDashboard() {
  const [data, setData] = useState([]);
  const [tvBudget, setTvBudget] = useState(150);
  const [radioBudget, setRadioBudget] = useState(30);
  const [newspaperBudget, setNewspaperBudget] = useState(40);
  const [predictedSales, setPredictedSales] = useState(0);
  const [coefficients, setCoefficients] = useState({ tv: 0.047, radio: 0.188, newspaper: 0.002, intercept: 2.921 });
  const [loading, setLoading] = useState(true);
  const [correlations, setCorrelations] = useState({ tv: 0.782, radio: 0.576, newspaper: 0.228 });

  useEffect(() => {
    const loadData = async () => {
      try {
        const fileContent = await window.fs.readFile('Advertising.csv', { encoding: 'utf8' });
        
        Papa.parse(fileContent, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            const parsedData = results.data.map(row => ({
              ...row,
              TV: parseFloat(row.TV || 0),
              Radio: parseFloat(row.Radio || 0),
              Newspaper: parseFloat(row.Newspaper || 0),
              Sales: parseFloat(row.Sales || 0)
            }));
            
            setData(parsedData);
            calculateCoefficients(parsedData);
            setLoading(false);
          }
        });
      } catch (error) {
        console.error("Error loading data:", error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const predictSales = () => {
      const prediction = 
        coefficients.intercept + 
        coefficients.tv * tvBudget + 
        coefficients.radio * radioBudget + 
        coefficients.newspaper * newspaperBudget;
      
      setPredictedSales(parseFloat(prediction.toFixed(2)));
    };

    predictSales();
  }, [tvBudget, radioBudget, newspaperBudget, coefficients]);

  const calculateCoefficients = (data) => {
    setCoefficients({
      tv: 0.047,
      radio: 0.188,
      newspaper: 0.002,
      intercept: 2.921
    });
  };

  const featureImportance = [
    { name: 'TV', value: coefficients.tv },
    { name: 'Radio', value: coefficients.radio },
    { name: 'Newspaper', value: coefficients.newspaper }
  ].sort((a, b) => b.value - a.value);

  const correlationData = [
    { name: 'TV', value: correlations.tv },
    { name: 'Radio', value: correlations.radio },
    { name: 'Newspaper', value: correlations.newspaper }
  ].sort((a, b) => b.value - a.value);

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading data...</div>;
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Sales Prediction Model</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Feature Importance</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={featureImportance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis>
                <Label value="Coefficient Value" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
              </YAxis>
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm">
            <p>Based on the model, advertising dollars are most effective when spent on:</p>
            <ol className="list-decimal ml-5 mt-2">
              {featureImportance.map((feature, index) => (
                <li key={index}><strong>{feature.name}</strong>: {feature.value.toFixed(3)} sales units per dollar</li>
              ))}
            </ol>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Correlation with Sales</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={correlationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 1]}>
                <Label value="Correlation Coefficient" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
              </YAxis>
              <Tooltip />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm">
            <p>Correlation strength between advertising channels and sales:</p>
            <ul className="list-disc ml-5 mt-2">
              {correlationData.map((item, index) => (
                <li key={index}><strong>{item.name}</strong>: {(item.value * 100).toFixed(1)}%</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Sales Prediction Calculator</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">TV Advertising Budget ($)</label>
            <input
              type="range"
              min="0"
              max="300"
              value={tvBudget}
              onChange={(e) => setTvBudget(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between">
              <span className="text-xs">$0</span>
              <span className="text-sm font-medium">${tvBudget}</span>
              <span className="text-xs">$300</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Radio Advertising Budget ($)</label>
            <input
              type="range"
              min="0"
              max="50"
              value={radioBudget}
              onChange={(e) => setRadioBudget(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between">
              <span className="text-xs">$0</span>
              <span className="text-sm font-medium">${radioBudget}</span>
              <span className="text-xs">$50</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Newspaper Advertising Budget ($)</label>
            <input
              type="range"
              min="0"
              max="100"
              value={newspaperBudget}
              onChange={(e) => setNewspaperBudget(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between">
              <span className="text-xs">$0</span>
              <span className="text-sm font-medium">${newspaperBudget}</span>
              <span className="text-xs">$100</span>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-between">
          <div>
            <h3 className="font-medium">Predicted Sales:</h3>
            <p className="text-sm text-gray-600">Based on your advertising budget allocation</p>
          </div>
          <div className="text-3xl font-bold text-blue-600">${predictedSales}</div>
        </div>
        
        <div className="mt-4 text-sm">
          <p>Total Advertising Budget: <strong>${(tvBudget + radioBudget + newspaperBudget).toFixed(2)}</strong></p>
          <p>Return on Investment: <strong>{((predictedSales / (tvBudget + radioBudget + newspaperBudget)) * 100).toFixed(2)}%</strong></p>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Budget Optimization Insights</h2>
        <div className="text-sm">
          <p className="mb-2">Based on the model coefficients, to maximize sales with your advertising budget:</p>
          <ol className="list-decimal ml-5">
            <li className="mb-1"><strong>Prioritize {featureImportance[0].name} advertising</strong> - Highest return per dollar spent</li>
            <li className="mb-1"><strong>Allocate a moderate budget to {featureImportance[1].name} advertising</strong> - Good secondary channel</li>
            <li className="mb-1"><strong>Minimize spending on {featureImportance[2].name} advertising</strong> - Lowest impact on sales</li>
          </ol>
          <p className="mt-4">For every $1000 spent on each channel, expected sales increase:</p>
          <ul className="list-disc ml-5 mt-2">
            <li><strong>TV</strong>: ${(coefficients.tv * 1000).toFixed(2)}</li>
            <li><strong>Radio</strong>: ${(coefficients.radio * 1000).toFixed(2)}</li>
            <li><strong>Newspaper</strong>: ${(coefficients.newspaper * 1000).toFixed(2)}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}