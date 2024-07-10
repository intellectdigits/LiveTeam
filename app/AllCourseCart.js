import { Image, Text, TouchableOpacity, View } from "react-native";
import {
  doc,
  deleteDoc,
  query,
  where,
  collection,
  getDocs,
} from "firebase/firestore";
import { router } from "expo-router";
import { db } from "../lib/firebase";
import { useContext, useEffect, useState } from "react";

const AllCourseCart = ({ item, user, delicon }) => {
  const [visible, setVisible] = useState(false);
  const [loadrating, setloadRating] = useState(true);
  const [ratings, setRating] = useState();
  const [cartloading, setcartloading] = useState(true);
  const [cartAdded, setCartAdded] = useState("nos");
  const [loading, setLoading] = useState(true);
  const [learningAdded, setLearningAdded] = useState("no");
  let rateval = 0;
  const fetchPost = async () => {
    const q = query(collection(db, "Cart"), where("user", "==", user));
    const querySnapshot = await getDocs(q);
    const newData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    const cart = newData.filter((data) => {
      return data.course === item.course;
    });
    if (cart.length > 0) {
      setCartAdded("yes");
    }
  };
  const fetchLearning = async () => {
    const q = query(collection(db, "MyLearning"), where("user", "==", user));
    const querySnapshot = await getDocs(q);
    const newData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    const learning = newData.filter((data) => {
      return data.course === item.course;
    });
    if (learning.length > 0) {
      setLearningAdded("yes");
    }
  };
  const fetchRating = async () => {
    const q = query(
      collection(db, "Ratings"),
      where("course", "==", item.course)
    );
    const querySnapshot = await getDocs(q);
    const newData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    setRating(newData.reverse());
    setloadRating(false);
  };
  const fetchCart = async () => {
    const q = query(
      collection(db, "Ratings"),
      where("course", "==", item.course)
    );
    const querySnapshot = await getDocs(q);
    const newData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    setRating(newData.reverse());
    setloadRating(false);
  };
  const EggFunction = () => {
    setPurpose("Egg");
    setVisible(false);
  };
  const MeatFunction = () => {
    setPurpose("Meat");
    setVisible(false);
  };
  const BothFunction = () => {
    setPurpose("Both");
    setVisible(false);
  };
  const hideMenu = () => setVisible(false);

  const showMenu = () => setVisible(true);
  const handleclick = () => {
    router.back();
    console.log("clicked");
  };
  useEffect(() => {
    fetchRating();
    fetchPost();
    fetchLearning;
  }, []);
  return (
    <TouchableOpacity
      onPress={() => {
        if (user == null) {
          router.push({ pathname: "/sign-in", params: { page: "/home" } });
        } else if (learningAdded == "yes") {
          router.push({
            pathname: "MyLearning",
            params: { user: user },
          });
        } else {
          router.push({
            pathname: "ViewCourses",
            params: {
              ...item,
              learningAdded: learningAdded,
              cartAdded: cartAdded,
            },
          });
        }
      }}
    >
      <View className="flex-row items-center w-full  justify-between bg-white rounded-3xl shadow-lg shadow-gray-500 mb-3 px-2 ">
        <Image
          className="rounded-3xl"
          style={{ height: 100, width: 100 }}
          source={{ uri: item.image }}
        />
        <View className="flex flex-1 space-x-5">
          <View className="pt-3 px-5">
            <Text className="text-xl">{item.course}</Text>
            <Text className="text-gray-700">{item.description}</Text>

            <View className="flex-row justify-between mt-3"></View>
          </View>
          <View className="flex-row justify-between py-3 pl-2 Item-center">
            {delicon !== "false" && (
              <TouchableOpacity
                onPress={async () => {
                  //  const q = query(collection(db, "Cart"), where("course", "==",item.course));
                  deleteDoc(doc(db, "Cart", item.id));
                  router.push({
                    pathname: "/Cart",
                    params: { user: item.user },
                  });
                }}
              >
                <Text className="text-blue-700 text-md ">Remove</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default AllCourseCart;
