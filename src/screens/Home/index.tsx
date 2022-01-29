import React, { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

import { Header } from "../../components/Header";
import { SearchBar } from "../../components/SearchBar";
import { LoginDataItem } from "../../components/LoginDataItem";

import {
	Container,
	Metadata,
	Title,
	TotalPassCount,
	LoginList,
} from "./styles";

interface LoginDataProps {
	id: string;
	service_name: string;
	email: string;
	password: string;
}

export type LoginListDataProps = LoginDataProps[];

export function Home() {
	const [searchText, setSearchText] = useState("");
	const [searchListData, setSearchListData] = useState<LoginListDataProps>([]);
	const [data, setData] = useState<LoginListDataProps>([]);

	async function loadData() {
		const dataKey = "@savepass:logins";
		// Get asyncStorage data, use setSearchListData and setData
		const rawData = await AsyncStorage.getItem(dataKey);
		const isThereData = Boolean(rawData);

		if (isThereData) {
			const newData = JSON.parse(rawData) as LoginListDataProps;

			setSearchListData(newData);
			setData(newData);
		}
	}

	function handleFilterLoginData() {
		// Filter results inside data, save with setSearchListData
		if (searchText) {
			const result = data.filter(
				({ service_name }) => service_name === searchText
			);

			setSearchListData(result);
		}
	}

	function handleChangeInputText(text: string) {
		// Update searchText value
		if (text) setSearchText(text);
		else setSearchListData(data);
	}

	useFocusEffect(
		useCallback(() => {
			loadData();
		}, [])
	);

	return (
		<>
			<Header
				user={{
					name: "Rocketseat",
					avatar_url: "https://i.ibb.co/ZmFHZDM/rocketseat.jpg",
				}}
			/>
			<Container>
				<SearchBar
					placeholder="Qual senha você procura?"
					onChangeText={handleChangeInputText}
					value={searchText}
					returnKeyType="search"
					onSubmitEditing={handleFilterLoginData}
					onSearchButtonPress={handleFilterLoginData}
				/>

				<Metadata>
					<Title>Suas senhas</Title>
					<TotalPassCount>
						{searchListData.length
							? `${`${searchListData.length}`.padStart(2, "0")} ao total`
							: "Nada a ser exibido"}
					</TotalPassCount>
				</Metadata>

				<LoginList
					keyExtractor={item => item.id}
					data={searchListData}
					renderItem={({ item: loginData }) => {
						return (
							<LoginDataItem
								service_name={loginData.service_name}
								email={loginData.email}
								password={loginData.password}
							/>
						);
					}}
				/>
			</Container>
		</>
	);
}
