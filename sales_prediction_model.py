import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score


df = pd.read_csv('advertisement.csv', index_col=0)

print("Data shape:", df.shape)
print("\nData overview:")
print(df.head())

print("\nMissing values:")
print(df.isnull().sum())

print("\nStatistical summary:")
print(df.describe())

plt.figure(figsize=(12, 10))

plt.subplot(2, 2, 1)
correlation_matrix = df.corr()
sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm')
plt.title('Correlation Matrix')

plt.subplot(2, 2, 2)
for i, feature in enumerate(['TV', 'Radio', 'Newspaper']):
    plt.scatter(df[feature], df['Sales'], label=feature)
plt.xlabel('Advertising Budget')
plt.ylabel('Sales')
plt.title('Sales vs. Advertising Channels')
plt.legend()

plt.subplot(2, 2, 3)
sns.histplot(df['Sales'], kde=True)
plt.title('Distribution of Sales')

plt.figure(figsize=(15, 5))
plt.subplot(1, 3, 1)
sns.regplot(x='TV', y='Sales', data=df)
plt.title('Sales vs TV Advertising')

plt.subplot(1, 3, 2)
sns.regplot(x='Radio', y='Sales', data=df)
plt.title('Sales vs Radio Advertising')

plt.subplot(1, 3, 3)
sns.regplot(x='Newspaper', y='Sales', data=df)
plt.title('Sales vs Newspaper Advertising')

X = df[['TV', 'Radio', 'Newspaper']]
y = df['Sales']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("\nTraining set shape:", X_train.shape)
print("Testing set shape:", X_test.shape)

model = LinearRegression()
model.fit(X_train, y_train)

print("\nModel Coefficients:")
print(f"Intercept: {model.intercept_:.4f}")
for i, feature in enumerate(X.columns):
    print(f"{feature} coefficient: {model.coef_[i]:.4f}")

y_pred = model.predict(X_test)

mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
r2 = r2_score(y_test, y_pred)

print("\nModel Evaluation:")
print(f"Mean Squared Error (MSE): {mse:.4f}")
print(f"Root Mean Squared Error (RMSE): {rmse:.4f}")
print(f"R-squared (R²): {r2:.4f}")

plt.figure(figsize=(10, 6))
plt.scatter(y_test, y_pred)
plt.xlabel('Actual Sales')
plt.ylabel('Predicted Sales')
plt.title('Predicted vs Actual Sales')
plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'k--')

plt.figure(figsize=(10, 6))
importance = pd.DataFrame({
    'Feature': X.columns,
    'Importance': np.abs(model.coef_)
})
importance = importance.sort_values('Importance', ascending=False)
sns.barplot(x='Importance', y='Feature', data=importance)
plt.title('Feature Importance')

print("\nModel Interpretation:")
print("For every $1000 spent on:")
for i, feature in enumerate(X.columns):
    print(f"- {feature} advertising: ${model.coef_[i] * 1000:.2f} increase in sales")

def predict_sales(tv, radio, newspaper):
    """Predict sales based on advertising budgets."""
    input_data = np.array([[tv, radio, newspaper]])
    prediction = model.predict(input_data)[0]
    return prediction

tv = 200
radio = 40
newspaper = 60
predicted_sales = predict_sales(tv, radio, newspaper)
print(f"\nPredicted sales with TV=${tv}, Radio=${radio}, Newspaper=${newspaper}: ${predicted_sales:.2f}")

print("\nBudget Allocation Optimization:")
print("Based on the model coefficients, the most effective advertising channels in descending order are:")
for feature, coef in importance.values:
    print(f"- {feature}: coefficient = {coef:.4f}")

print("\nTo maximize sales with a limited budget, consider allocating more budget to channels with higher coefficients.")

plt.tight_layout()
plt.show()